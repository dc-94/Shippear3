"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import LoginButton from "@/components/LoginButton";
import {
  scoreQuiz,
  levelForScore,
  maxScore,
  type Quiz,
  type Answers,
} from "@/lib/quiz";

const NIVEL_LABEL: Record<string, string> = {
  inicial: "Inicial",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
};

type Estado = "respondiendo" | "guardando" | "guardado" | "error" | "sin-login";

export default function Quiz({
  quiz,
  isLoggedIn,
}: {
  quiz: Quiz;
  isLoggedIn: boolean;
}) {
  const [answers, setAnswers] = useState<Answers>({});
  const [resultado, setResultado] = useState<{ score: number; level: string } | null>(
    null
  );
  const [estado, setEstado] = useState<Estado>("respondiendo");

  const todasRespondidas = quiz.questions.every((q) => answers[q.id]);

  async function enviar() {
    const score = scoreQuiz(quiz, answers);
    const level = levelForScore(score, quiz.levels);
    setResultado({ score, level });

    if (!isLoggedIn) {
      setEstado("sin-login");
      return;
    }

    setEstado("guardando");
    const supabase = createClient();
    // user_id lo completa la base con auth.uid() (ver supabase/schema.sql).
    const { error } = await supabase
      .from("quiz_attempt")
      .insert({ score, level, answers });
    setEstado(error ? "error" : "guardado");
  }

  function rehacer() {
    setAnswers({});
    setResultado(null);
    setEstado("respondiendo");
  }

  // --- Vista de resultado ---
  if (resultado) {
    return (
      <div>
        <div className="side-card" style={{ borderLeft: "4px solid var(--accent)" }}>
          <div className="cardlab">Tu nivel</div>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 32,
              lineHeight: 1.1,
            }}
          >
            {NIVEL_LABEL[resultado.level] ?? resultado.level}
          </p>
          <p className="muted" style={{ marginTop: 2 }}>
            Puntaje: {resultado.score} / {maxScore(quiz)}
          </p>

          {estado === "guardando" && (
            <p className="muted" style={{ marginTop: 12, fontSize: 13 }}>
              Guardando…
            </p>
          )}
          {estado === "guardado" && (
            <p style={{ marginTop: 12, fontSize: 13, color: "var(--pos)" }}>
              ✓ Guardado en tu cuenta.
            </p>
          )}
          {estado === "error" && (
            <p style={{ marginTop: 12, fontSize: 13, color: "var(--neg)" }}>
              No se pudo guardar. Probá de nuevo.
            </p>
          )}
          {estado === "sin-login" && (
            <div
              style={{
                marginTop: 12,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span className="muted" style={{ fontSize: 13 }}>
                Ingresá para guardar tu nivel:
              </span>
              <LoginButton />
            </div>
          )}
        </div>

        {/* Repaso de las respuestas */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 20 }}>
          {quiz.questions.map((q) => {
            const elegida = answers[q.id];
            const ok = elegida === q.correct;
            const correcta = q.options.find((o) => o.id === q.correct)?.text;
            return (
              <div key={q.id} className="panel">
                <p style={{ fontWeight: 600 }}>{q.text}</p>
                <p
                  style={{
                    marginTop: 6,
                    fontSize: 14,
                    color: ok ? "var(--pos)" : "var(--neg)",
                  }}
                >
                  {ok ? "Correcto" : "Incorrecto"} — respuesta correcta: {correcta}
                </p>
                <p className="muted" style={{ marginTop: 4, fontSize: 14 }}>
                  {q.explanation}
                </p>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          <button onClick={rehacer} className="btn ghost">
            Rehacer
          </button>
          <Link href="/mis-avances" className="btn primary">
            Ir a mis avances
          </Link>
        </div>
      </div>
    );
  }

  // --- Vista de preguntas ---
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {quiz.questions.map((q, i) => (
          <div key={q.id} className="panel">
            <p className="q">
              {i + 1}. {q.text}
            </p>
            <div className="opts" style={{ marginTop: 12 }}>
              {q.options.map((o, idx) => {
                const sel = answers[q.id] === o.id;
                return (
                  <button
                    key={o.id}
                    type="button"
                    className={`opt${sel ? " selected" : ""}`}
                    onClick={() =>
                      setAnswers((a) => ({ ...a, [q.id]: o.id }))
                    }
                  >
                    <span className="mk">{String.fromCharCode(65 + idx)}</span>{" "}
                    {o.text}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={enviar}
        disabled={!todasRespondidas}
        className="btn primary"
        style={{ marginTop: 24, opacity: todasRespondidas ? 1 : 0.4 }}
      >
        Ver mi nivel
      </button>
      {!todasRespondidas && (
        <p className="muted" style={{ fontSize: 13, marginTop: 8 }}>
          Respondé todas las preguntas para continuar.
        </p>
      )}
    </div>
  );
}
