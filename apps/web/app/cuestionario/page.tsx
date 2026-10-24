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
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="mb-2 text-3xl font-bold">Cuestionario de nivel</h1>
      <p className="mb-6 text-gray-600">
        Respondé estas preguntas para ubicar tu punto de partida: inicial,
        intermedio o avanzado.
      </p>
      <Quiz quiz={quiz} isLoggedIn={!!user} />
    </main>
  );
}
