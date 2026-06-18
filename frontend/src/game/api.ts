import type { Difficulty, Question } from "./questions";

const BASE_URL = "https://questcode-nine.vercel.app";

interface BackendQuestion {
  code: string;
  answer: string;
  language: string;
}

interface BackendResponse {
  response: {
    questions: BackendQuestion[];
    difficulty: number;
  };
  difficulty: string;
}

export async function fetchQuestions(
  difficulty: Difficulty,
  amount = 10,
): Promise<Question[]> {
  const url = `${BASE_URL}/generate_question?question_amount=${amount}&difficulty=${difficulty}`;
  const res = await fetch(url, { method: "POST" });
  if (!res.ok) throw new Error(`API error: ${res.status}`);

  const data: BackendResponse = await res.json();

  return data.response.questions.map((q) => ({
    code: q.code,
    answer: q.answer,
    language: q.language === "python" ? "python" : "javascript",
  }));
}
