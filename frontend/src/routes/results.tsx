import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  addToRanking,
  clearSession,
  loadRanking,
  loadSession,
  saveSession,
  type RankingEntry,
} from "@/game/store";
import { clearRound } from "./play";

export const Route = createFileRoute("/results")({
  component: ResultsPage,
});

function feedbackFor(score: number) {
  if (score === 10) return "Impecável. Acertou todos os trechos.";
  if (score >= 8) return "Muito bom. Alguns casos extremos passaram despercebidos.";
  if (score >= 5) return "Boa base. Continue praticando.";
  if (score >= 2) return "Revise os fundamentos.";
  return "Todo desenvolvedor começa aqui. Tente o modo Fácil.";
}

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: "Fácil",
  medium: "Médio",
  hard: "Difícil",
};

const PODIUM_STYLES = [
  { h: "h-28", color: "bg-accent text-accent-foreground", label: "1º" },
  { h: "h-20", color: "bg-primary/70 text-primary-foreground", label: "2º" },
  { h: "h-14", color: "bg-primary/40 text-primary-foreground", label: "3º" },
];

function ResultsPage() {
  const navigate = useNavigate();
  const [session] = useState(() => loadSession());
  const [ranking, setRanking] = useState<RankingEntry[]>([]);

  useEffect(() => {
    if (!session) {
      navigate({ to: "/" });
      return;
    }
    const updated = addToRanking({
      name: session.name,
      difficulty: session.difficulty,
      score: session.score,
      date: Date.now(),
    });
    setRanking(updated.length ? updated : loadRanking());
  }, [session, navigate]);

  const podium = useMemo(() => ranking.slice(0, 3), [ranking]);
  const podiumDisplay = useMemo(
    () => [
      { entry: podium[1], style: PODIUM_STYLES[1] },
      { entry: podium[0], style: PODIUM_STYLES[0] },
      { entry: podium[2], style: PODIUM_STYLES[2] },
    ],
    [podium]
  );

  if (!session) return null;

  const fb = feedbackFor(session.score);
  const pct = Math.round((session.score / 10) * 100);
  const meKey = session.name.trim().toLowerCase();

  function playAgain() {
    clearRound();
    saveSession({ ...session!, score: 0, currentIndex: 0, finished: false });
    navigate({ to: "/play" });
  }

  function backToMenu() {
    clearRound();
    clearSession();
    navigate({ to: "/" });
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md text-center">
        <div className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
          03 — Resultados
        </div>

        <div className="mb-10">
          <div className="font-mono text-sm text-muted-foreground mb-2">{session.name}</div>
          <div className="flex items-baseline justify-center gap-3">
            <span className="font-mono text-7xl font-medium tracking-tight text-foreground leading-none">
              {session.score}
            </span>
            <span className="font-mono text-2xl text-muted-foreground">/ 10</span>
          </div>
          <div className="mt-3 font-mono text-xs uppercase tracking-[0.15em] text-accent">
            {pct}% de acerto
          </div>
        </div>

        <p className="text-foreground text-base leading-relaxed mb-2">{fb}</p>
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground mb-10">
          Dificuldade — {DIFFICULTY_LABEL[session.difficulty] ?? session.difficulty}
        </p>

        <div className="mb-12">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
            Ranking
          </div>

          <div className="flex items-end justify-center gap-2 mb-6">
            {podiumDisplay.map(({ entry, style }, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className="font-mono text-xs text-muted-foreground mb-1 truncate max-w-full">
                  {entry ? entry.name : "—"}
                </div>
                <div className="font-mono text-xl font-medium text-foreground mb-1">
                  {entry ? entry.score : "—"}
                </div>
                <div
                  className={`w-full ${style.h} ${entry ? style.color : "bg-muted text-muted-foreground"} flex items-start justify-center pt-2 font-mono text-xs uppercase tracking-widest`}
                >
                  {style.label}
                </div>
              </div>
            ))}
          </div>

          {ranking.length > 0 && (
            <ul className="text-left border-t border-border">
              {ranking.slice(0, 10).map((e, i) => {
                const isMe = e.name.trim().toLowerCase() === meKey;
                return (
                  <li
                    key={`${e.name}-${i}`}
                    className={`flex items-center justify-between border-b border-border py-2 font-mono text-xs ${
                      isMe ? "text-accent" : ""
                    }`}
                  >
                    <span className="w-8 text-muted-foreground">
                      #{String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={`flex-1 px-3 truncate ${isMe ? "text-accent" : "text-foreground"}`}>
                      {e.name}
                      {isMe && <span className="ml-2 text-[10px] uppercase">você</span>}
                    </span>
                    <span className="text-muted-foreground mr-3 uppercase">{DIFFICULTY_LABEL[e.difficulty] ?? e.difficulty}</span>
                    <span className={isMe ? "text-accent" : "text-foreground"}>{e.score}/10</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="space-y-3">
          <Button
            onClick={playAgain}
            className="w-full h-11 rounded-none font-mono text-sm font-normal tracking-wide bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Jogar novamente
          </Button>
          <Button
            onClick={backToMenu}
            variant="ghost"
            className="w-full h-11 rounded-none font-mono text-sm font-normal tracking-wide text-muted-foreground hover:text-foreground hover:bg-transparent"
          >
            ← Voltar ao menu
          </Button>
        </div>
      </div>
    </main>
  );
}
