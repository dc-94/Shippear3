// Tipos y lógica pura del cuestionario de nivel.
// Sin acceso a disco (no importa "fs"): se puede usar tanto en el server como
// en el cliente. La carga de content/quiz.json se hace en el server component.

export type QuizOption = { id: string; text: string };

export type QuizQuestion = {
  id: string;
  dimension: string;
  topic: string;
  text: string;
  options: QuizOption[];
  correct: string;
  explanation: string;
  points: number;
};

export type QuizLevel = { id: string; minScore: number };

export type Quiz = {
  version: number;
  levels: QuizLevel[];
  questions: QuizQuestion[];
};

// { [idPregunta]: idOpciónElegida }
export type Answers = Record<string, string>;

// Puntaje total máximo posible (suma de puntos de todas las preguntas).
export function maxScore(quiz: Quiz): number {
  return quiz.questions.reduce((total, q) => total + q.points, 0);
}

// Suma los puntos de las respuestas correctas.
export function scoreQuiz(quiz: Quiz, answers: Answers): number {
  return quiz.questions.reduce(
    (total, q) => total + (answers[q.id] === q.correct ? q.points : 0),
    0
  );
}

// Devuelve el id del nivel más alto cuyo umbral (minScore) no supera el puntaje.
export function levelForScore(score: number, levels: QuizLevel[]): string {
  const ordenados = [...levels].sort((a, b) => b.minScore - a.minScore);
  return ordenados.find((l) => score >= l.minScore)?.id ?? "inicial";
}
