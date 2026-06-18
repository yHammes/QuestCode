import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CodeBlock } from "@/game/CodeBlock";
import { QUESTIONS, type Question } from "@/game/questions";
import { loadSession, saveSession } from "@/game/store";

export const Route = createFileRoute("/play")({
  component: PlayPage,
});

const ROUND_KEY = "codequest:round";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function loadRound(): Question[] | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(ROUND_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function saveRound(qs: Question[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ROUND_KEY, JSON.stringify(qs));
}

export function clearRound() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ROUND_KEY);
}

function PlayPage() {
  const navigate = useNavigate();
  const [session] = useState(() => loadSession());

  const questions = useMemo<Question[]>(() => {
    if (!session) return [];
    const cached = loadRound();
    if (cached && cached.length === 10) return cached;
    const fresh = shuffle(QUESTIONS[session.difficulty]).slice(0, 10);
    saveRound(fresh);
    return fresh;
  }, [session?.difficulty]);

  const [idx, setIdx] = useState(() => session?.currentIndex ?? 0);
  const [score, setScore] = useState(() => session?.score ?? 0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<null | { correct: boolean; expected: string }>(null);

  useEffect(() => {
    if (!session) navigate({ to: "/" });
  }, [session, navigate]);

  useEffect(() => {
    if (!session) return;
    saveSession({ ...session, score, currentIndex: idx });
  }, [score, idx]);

  if (!session || questions.length === 0) return null;

  const q = questions[idx];
  const total = questions.length;

  function normalize(s: string) {
    return s.trim().replace(/\s+/g, " ").replace(/^["']|["']$/g, "");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (feedback) return;
    const correct = normalize(answer) === normalize(q.answer);
    if (correct) setScore((s) => s + 1);
    setFeedback({ correct, expected: q.answer });
  }

  function handleNext() {
    setFeedback(null);
    setAnswer("");
    if (idx + 1 >= total) {
      saveSession({ ...session!, score, currentIndex: total, finished: true });
      clearRound();
      navigate({ to: "/results" });
    } else {
      setIdx(idx + 1);
    }
  }

  function handleGiveUp() {
    saveSession({ ...session!, score, currentIndex: idx, finished: true });
    clearRound();
    navigate({ to: "/results" });
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <header className="flex items-center justify-between mb-10 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
          <div>{session.name}</div>
          <div className="flex gap-6">
            <span>
              <span className="text-foreground">{String(idx + 1).padStart(2, "0")}</span> / {String(total).padStart(2, "0")}
            </span>
            <span>
              Pontos <span className="text-foreground">{score}</span>
            </span>
          </div>
        </header>

        <div className="flex gap-1 mb-12">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`h-px flex-1 transition-colors ${
                i < idx ? "bg-accent" : i === idx ? "bg-foreground" : "bg-border"
              }`}
            />
          ))}
        </div>

        <div className="mb-4 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
          O que isto imprime?
        </div>

        <CodeBlock code={q.code} language={q.language} />

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <div>
            <label className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground block mb-2">
              Sua resposta
            </label>
            <Input
              autoFocus
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Saída esperada"
              disabled={!!feedback}
              className="h-11 rounded-none border-0 border-b border-border bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:border-foreground font-mono text-base"
            />
          </div>

          {!feedback ? (
            <Button
              type="submit"
              disabled={!answer.trim()}
              className="w-full h-11 rounded-none font-mono text-sm font-normal tracking-wide bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Enviar
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="border-l-2 pl-4 py-1 font-mono text-sm" style={{ borderColor: feedback.correct ? "var(--success)" : "var(--destructive)" }}>
                {feedback.correct ? (
                  <span className="text-foreground">Correto</span>
                ) : (
                  <span className="text-foreground">
                    Esperado <span className="text-muted-foreground">{feedback.expected}</span>
                  </span>
                )}
              </div>
              <Button
                type="button"
                onClick={handleNext}
                className="w-full h-11 rounded-none font-mono text-sm font-normal tracking-wide bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {idx + 1 >= total ? "Ver resultados →" : "Próxima →"}
              </Button>
            </div>
          )}
        </form>

        <div className="mt-10 flex justify-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                type="button"
                className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-destructive transition-colors"
              >
                Desistir
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-none border-border">
              <AlertDialogHeader>
                <AlertDialogTitle className="font-mono">Desistir da partida?</AlertDialogTitle>
                <AlertDialogDescription>
                  Sua pontuação atual de <span className="text-foreground font-mono">{score}</span> será registrada no ranking e você será levado para a tela de resultados.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-none font-mono">Continuar jogando</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleGiveUp}
                  className="rounded-none font-mono bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Desistir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </main>
  );
}
