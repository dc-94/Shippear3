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
        <div className="rounded-xl border p-6">
          <p className="text-sm text-gray-600">Tu nivel</p>
          <p className="text-3xl font-bold">
            {NIVEL_LABEL[resultado.level] ?? resultado.level}
          </p>
          <p className="mt-1 text-gray-600">
            Puntaje: {resultado.score} / {maxScore(quiz)}
          </p>

          {estado === "guardando" && (
            <p className="mt-3 text-sm text-gray-500">Guardando…</p>
          )}
          {estado === "guardado" && (
            <p className="mt-3 text-sm text-green-600">✓ Guardado en tu cuenta.</p>
          )}
          {estado === "error" && (
            <p className="mt-3 text-sm text-red-600">
              No se pudo guardar. Probá de nuevo.
            </p>
          )}
          {estado === "sin-login" && (
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              <span className="text-gray-600">Ingresá para guardar tu nivel:</span>
              <LoginButton />
            </div>
          )}
        </div>

        {/* Repaso de las respuestas */}
        <ul className="mt-6 space-y-4">
          {quiz.questions.map((q) => {
            const elegida = answers[q.id];
            const ok = elegida === q.correct;
            const correcta = q.options.find((o) => o.id === q.correct)?.text;
            return (
              <li key={q.id} className="rounded-lg border p-4">
                <p className="font-medium">{q.text}</p>
                <p
                  className={`mt-1 text-sm ${
                    ok ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {ok ? "Correcto" : "Incorrecto"} — respuesta correcta: {correcta}
                </p>
                <p className="mt-1 text-sm text-gray-600">{q.explanation}</p>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 flex gap-3">
          <button onClick={rehacer} className="rounded-lg border px-4 py-2">
            Rehacer
          </button>
          <Link
            href="/mis-avances"
            className="rounded-lg bg-black px-4 py-2 text-white"
          >
            Ir a mis avances
          </Link>
        </div>
      </div>
    );
  }

  // --- Vista de preguntas ---
  return (
    <div>
      <ol className="space-y-6">
        {quiz.questions.map((q, i) => (
          <li key={q.id} className="rounded-lg border p-4">
            <p className="font-medium">
              {i + 1}. {q.text}
            </p>
            <div className="mt-3 space-y-2">
              {q.options.map((o) => (
                <label
                  key={o.id}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <input
                    type="radio"
                    name={q.id}
                    value={o.id}
                    checked={answers[q.id] === o.id}
                    onChange={() =>
                      setAnswers((a) => ({ ...a, [q.id]: o.id }))
                    }
                  />
                  <span>{o.text}</span>
                </label>
              ))}
            </div>
          </li>
        ))}
      </ol>

      <button
        onClick={enviar}
        disabled={!todasRespondidas}
        className="mt-6 rounded-lg bg-black px-5 py-2 text-white disabled:opacity-40"
      >
        Ver mi nivel
      </button>
      {!todasRespondidas && (
        <p className="mt-2 text-sm text-gray-500">
          Respondé todas las preguntas para continuar.
        </p>
      )}
    </div>
  );
}
