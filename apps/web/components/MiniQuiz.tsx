"use client";

import { useState } from "react";
import type { CursoQuiz } from "@/lib/cursos";

export default function MiniQuiz({ quiz }: { quiz: CursoQuiz }) {
  const [answered, setAnswered] = useState<number | null>(null);

  return (
    <div className="panel quiz" style={{ marginTop: 6 }}>
      <span className="eyebrow">Mini quiz</span>
      <h3 style={{ fontSize: 17, margin: "4px 0 2px" }}>¿Lo pescaste?</h3>
      <p className="qmeta">1 pregunta</p>
      <p className="q">{quiz.q}</p>
      <div className="opts">
        {quiz.opts.map((o, idx) => {
          let cls = "opt";
          if (answered !== null) {
            if (o.ok) cls += " correct";
            else if (idx === answered) cls += " wrong";
          }
          return (
            <button
              key={idx}
              className={cls}
              disabled={answered !== null}
              onClick={() => setAnswered(idx)}
            >
              <span className="mk">{String.fromCharCode(65 + idx)}</span> {o.t}
            </button>
          );
        })}
      </div>
      {answered !== null && (
        <div className="feedback">
          <b>{quiz.opts[answered].ok ? "¡Correcto! ✓" : "Casi."}</b> {quiz.fb}
        </div>
      )}
    </div>
  );
}
