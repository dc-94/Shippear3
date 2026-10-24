"use client";

import { useState, useRef, useEffect } from "react";

type Msg = { role: "user" | "assistant"; content: string };

const SALUDO: Msg = {
  role: "assistant",
  content:
    "¡Hola! Soy tu tutor de Plata Clara. Preguntame lo que quieras sobre finanzas: qué es la inflación, cómo funciona un CEDEAR, qué mide el riesgo país… Te lo explico a tu nivel. (No doy consejos de inversión.)",
};

const SUGERENCIAS = [
  "¿Qué es la inflación?",
  "¿Qué diferencia hay entre plazo fijo y dólar?",
  "¿Qué es un CEDEAR?",
  "¿Qué significa el riesgo país?",
];

export default function TutorChat() {
  const [messages, setMessages] = useState<Msg[]>([SALUDO]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function enviar(texto: string) {
    const limpio = texto.trim();
    if (!limpio || loading) return;
    const nuevos: Msg[] = [...messages, { role: "user", content: limpio }];
    setMessages(nuevos);
    setInput("");
    setError(null);
    setLoading(true);
    try {
      const r = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // mandamos sin el saludo inicial (es solo de la UI)
        body: JSON.stringify({ messages: nuevos.slice(1) }),
      });
      const data = await r.json();
      if (!r.ok) {
        setError(data.error ?? "Error al consultar al tutor.");
      } else {
        setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
      }
    } catch {
      setError("No se pudo conectar con el tutor. Probá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chat">
      <div className="msgs">
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role === "user" ? "user" : "bot"}`}>
            {m.content}
          </div>
        ))}
        {loading && <div className="bubble bot">Pensando…</div>}
        {error && (
          <div className="bubble bot" style={{ color: "var(--neg)" }}>
            {error}
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="sugs">
        {SUGERENCIAS.map((s) => (
          <button key={s} type="button" onClick={() => enviar(s)} disabled={loading}>
            {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          enviar(input);
        }}
      >
        <input
          className="ask"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribí tu pregunta…"
          disabled={loading}
          aria-label="Tu pregunta"
        />
        <button
          type="submit"
          className="btn primary"
          disabled={loading || !input.trim()}
        >
          Enviar
        </button>
      </form>

      <p className="muted" style={{ fontSize: 11.5 }}>
        Contenido educativo generado con IA. No es asesoramiento de inversión.
      </p>
    </div>
  );
}
