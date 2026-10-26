import { createClient } from "@/lib/supabase/server";
import { dolares, inflacion, riesgoPais, uva, ultimo } from "@/lib/mercado";

export const runtime = "nodejs";
export const maxDuration = 60;

// Tutor con Google Gemini (tier gratuito), nueva Interactions API.
// gemini-3.1-flash-lite: el más rápido/estable de los disponibles para keys nuevas.
const GEMINI_MODEL = "gemini-3.1-flash-lite";
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/interactions";
const TIMEOUT_MS = 22000;

function systemPrompt(nivel: string, mercado: string) {
  return `Sos el tutor de Plata Clara, una app argentina de educación financiera.
Explicás conceptos financieros (inflación, dólar, acciones, bonos, plazo fijo, FCI, cripto, riesgo país, UVA, etc.) en castellano rioplatense claro y simple, con ejemplos de Argentina.

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
type GeminiStep = { type?: string; content?: { type?: string; text?: string }[] };

// Llama a Gemini con timeout por intento; reintenta una vez ante 503/429/timeout.
async function callGemini(apiKey: string, input: string): Promise<Response> {
  const body = JSON.stringify({ model: GEMINI_MODEL, input, store: false });
  let last: Response | null = null;
  for (let intento = 0; intento < 2; intento++) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    try {
      const r = await fetch(GEMINI_URL, {
        method: "POST",
        headers: { "x-goog-api-key": apiKey, "Content-Type": "application/json" },
        body,
        signal: ctrl.signal,
      });
      clearTimeout(t);
      last = r;
      if (r.status !== 503 && r.status !== 429) return r;
    } catch (e) {
      clearTimeout(t);
      if (intento === 1) throw e; // en el último intento, propagá (abort/red)
    }
    await new Promise((res) => setTimeout(res, 900));
  }
  return last as Response;
}

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

  // La Interactions API toma un único `input`: instrucciones + conversación aplanada.
  const transcript = messages
    .map((m) => `${m.role === "user" ? "Usuario" : "Tutor"}: ${m.content}`)
    .join("\n");
  const input = `${systemPrompt(nivel, mercado)}

--- Conversación (respondé como "Tutor", solo tu próxima respuesta) ---
${transcript}
Tutor:`;

  try {
    const r = await callGemini(apiKey, input);

    if (!r.ok) {
      if (r.status === 503 || r.status === 429) {
        return Response.json(
          { error: "El modelo está con mucha demanda. Probá de nuevo en unos segundos." },
          { status: 503 }
        );
      }
      if (r.status === 400 || r.status === 401 || r.status === 403) {
        return Response.json(
          { error: "La API key de Gemini es inválida o no tiene permisos." },
          { status: 500 }
        );
      }
      return Response.json(
        { error: "No se pudo generar la respuesta. Probá de nuevo." },
        { status: 500 }
      );
    }

    const data = await r.json();
    const steps: GeminiStep[] = Array.isArray(data?.steps) ? data.steps : [];
    const salida = steps.filter((s) => s.type === "model_output").pop();
    const text = (salida?.content ?? [])
      .filter((c) => c.type === "text")
      .map((c) => c.text ?? "")
      .join("")
      .trim()
      .replace(/^Tutor:\s*/i, ""); // el modelo a veces repite el prefijo "Tutor:"

    return Response.json({ reply: text || "No tengo una respuesta para eso ahora." });
  } catch (e) {
    const abort = e instanceof Error && e.name === "AbortError";
    console.error("tutor error:", e);
    return Response.json(
      {
        error: abort
          ? "El tutor tardó demasiado. Probá de nuevo."
          : "No se pudo conectar con el tutor. Probá de nuevo.",
      },
      { status: abort ? 504 : 500 }
    );
  }
}
