import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { dolares, inflacion, riesgoPais, uva, ultimo } from "@/lib/mercado";

export const runtime = "nodejs";

// Rápido y barato para un tutor de chat. Más potente (pero caro): "claude-opus-5-5".
const MODEL = "claude-haiku-5-5";

function systemPrompt(nivel: string, mercado: string) {
  return `Sos el tutor de Plata Clara, una app argentina de educación financiera.
Tu trabajo es EXPLICAR conceptos financieros (inflación, dólar, acciones, bonos, plazo fijo, FCI, cripto, riesgo país, UVA, etc.) en castellano rioplatense claro y simple, con ejemplos de Argentina.

Nivel del usuario: ${nivel}. Adaptá la profundidad y el vocabulario a ese nivel.

Datos de mercado de hoy (usalos solo si vienen al caso; no inventes otros números):
${mercado}

Reglas:
- NUNCA des consejos de inversión personalizados ni recomendes comprar/vender un activo concreto. Si te lo piden, aclaralo con amabilidad y reencauzá a lo educativo ("puedo explicarte cómo funciona, pero no decirte qué comprar").
- Respuestas breves y claras (2 a 5 frases, o una lista corta). Sin jerga; si usás un término técnico, explicalo en la misma frase.
- Si la pregunta no es de finanzas ni economía, decí amablemente que ese es tu tema y ofrecé ayuda ahí.
- No inventes datos ni cifras actuales que no estén en la lista de arriba.`;
}

async function getMercadoContext(): Promise<string> {
  const [d, ipc, rp, u] = await Promise.all([
    dolares(),
    inflacion(),
    riesgoPais(),
    uva(),
  ]);
  const casa = (c: string) => d?.find((x) => x.casa === c)?.venta ?? null;
  const lines: string[] = [];
  if (casa("oficial")) lines.push(`- Dólar oficial: $${casa("oficial")}`);
  if (casa("blue")) lines.push(`- Dólar blue: $${casa("blue")}`);
  if (casa("bolsa")) lines.push(`- Dólar MEP: $${casa("bolsa")}`);
  const i = ultimo(ipc);
  if (i) lines.push(`- Inflación mensual: ${i.valor}% (${i.fecha})`);
  const r = ultimo(rp);
  if (r) lines.push(`- Riesgo país: ${r.valor} pb (${r.fecha})`);
  const uu = ultimo(u);
  if (uu) lines.push(`- UVA: $${uu.valor} (${uu.fecha})`);
  return lines.length ? lines.join("\n") : "(sin datos de mercado disponibles ahora)";
}

type InMsg = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      {
        error:
          "Falta configurar ANTHROPIC_API_KEY en apps/web/.env.local (y reiniciar el dev server).",
      },
      { status: 500 }
    );
  }

  let body: { messages?: InMsg[] };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Body inválido." }, { status: 400 });
  }

  const incoming = Array.isArray(body.messages) ? body.messages : [];
  const messages: Anthropic.MessageParam[] = incoming
    .filter(
      (m) =>
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0
    )
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));

  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return Response.json(
      { error: "Falta un mensaje del usuario." },
      { status: 400 }
    );
  }

  // Contexto: nivel del usuario (si está logueado) + datos de mercado.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let nivel = "desconocido (asumí principiante)";
  if (user) {
    const { data } = await supabase
      .from("quiz_attempt")
      .select("level")
      .order("created_at", { ascending: false })
      .limit(1);
    if (data?.[0]?.level) nivel = data[0].level as string;
  }
  const mercado = await getMercadoContext();

  const client = new Anthropic();
  try {
    const resp = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      output_config: { effort: "low" },
      system: systemPrompt(nivel, mercado),
      messages,
    });

    if (resp.stop_reason === "refusal") {
      return Response.json({
        reply:
          "Perdón, no puedo ayudarte con eso. ¿Querés que te explique algún concepto financiero?",
      });
    }

    const text = resp.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    return Response.json({ reply: text || "No tengo una respuesta para eso ahora." });
  } catch (e) {
    if (e instanceof Anthropic.AuthenticationError) {
      return Response.json(
        { error: "La API key de Claude es inválida. Revisá ANTHROPIC_API_KEY." },
        { status: 500 }
      );
    }
    if (e instanceof Anthropic.RateLimitError) {
      return Response.json(
        { error: "Demasiadas consultas por ahora. Probá en un momento." },
        { status: 429 }
      );
    }
    console.error("tutor error:", e);
    return Response.json(
      { error: "No se pudo generar la respuesta. Probá de nuevo." },
      { status: 500 }
    );
  }
}
