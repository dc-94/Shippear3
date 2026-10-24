import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@/lib/supabase/server";
import Quiz from "@/components/Quiz";
import type { Quiz as QuizData } from "@/lib/quiz";

// content/ vive en la raíz del repo; desde apps/web son dos niveles arriba.
async function getQuiz(): Promise<QuizData> {
  const file = path.join(process.cwd(), "..", "..", "content", "quiz.json");
  const raw = await readFile(file, "utf-8");
  return JSON.parse(raw) as QuizData;
}

export default async function CuestionarioPage() {
  const quiz = await getQuiz();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <section className="view">
      <div className="wrap">
        <span className="eyebrow">Diagnóstico</span>
        <h2 style={{ fontSize: "clamp(24px,3.5vw,32px)", margin: "6px 0 4px" }}>
          Cuestionario de nivel
        </h2>
        <p className="muted" style={{ maxWidth: "60ch", marginBottom: 22 }}>
          Respondé estas preguntas para ubicar tu punto de partida: inicial,
          intermedio o avanzado.
        </p>
        <Quiz quiz={quiz} isLoggedIn={!!user} />
      </div>
    </section>
  );
}
