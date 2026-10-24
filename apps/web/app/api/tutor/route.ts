import { createClient } from "@/lib/supabase/server";
import { dolares, inflacion, riesgoPais, uva, ultimo } from "@/lib/mercado";

export const runtime = "nodejs";

// Tutor con Google Gemini (tier gratuito). Para cambiar de modelo: gemini-2.5-flash, etc.
const GEMINI_MODEL = "gemini-2.0-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

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
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(
      {
        error:
          "Falta configurar GEMINI_API_KEY en apps/web/.env.local (y reiniciar el dev server).",
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
  const messages = incoming
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

  // Gemini usa roles "user" y "model", y system_instruction aparte.
  const gemBody = {
    system_instruction: { parts: [{ text: systemPrompt(nivel, mercado) }] },
    contents: messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
    generationConfig: { maxOutputTokens: 1024, temperature: 0.4 },
  };

  try {
    const r = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gemBody),
    });

    if (!r.ok) {
      if (r.status === 400 || r.status === 403) {
        return Response.json(
          { error: "La API key de Gemini es inválida o no tiene permisos." },
          { status: 500 }
        );
      }
      if (r.status === 429) {
        return Response.json(
          { error: "Demasiadas consultas por ahora. Probá en un momento." },
          { status: 429 }
        );
      }
      return Response.json(
        { error: "No se pudo generar la respuesta. Probá de nuevo." },
        { status: 500 }
      );
    }

    const data = await r.json();

    // ¿Bloqueado por filtros de seguridad?
    const cand = data?.candidates?.[0];
    if (data?.promptFeedback?.blockReason || cand?.finishReason === "SAFETY") {
      return Response.json({
        reply:
          "Perdón, no puedo ayudarte con eso. ¿Querés que te explique algún concepto financiero?",
      });
    }

    const text: string = (cand?.content?.parts ?? [])
      .map((p: { text?: string }) => p.text ?? "")
      .join("")
      .trim();

    return Response.json({ reply: text || "No tengo una respuesta para eso ahora." });
  } catch (e) {
    console.error("tutor error:", e);
    return Response.json(
      { error: "No se pudo conectar con el tutor. Probá de nuevo." },
      { status: 500 }
    );
  }
}
