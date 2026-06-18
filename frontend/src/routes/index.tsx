import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loadSession, saveSession } from "@/game/store";
import type { Difficulty } from "@/game/questions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CodeQuest — Preveja a Saída" },
      { name: "description", content: "Aprimore sua lógica de programação prevendo saídas de código em desafios de JavaScript e Python." },
      { property: "og:title", content: "CodeQuest — Preveja a Saída" },
      { property: "og:description", content: "Um jogo minimalista para praticar lógica de programação." },
    ],
  }),
  component: StartMenu,
});

const LEVELS: { id: Difficulty; label: string }[] = [
  { id: "easy", label: "Fácil" },
  { id: "medium", label: "Médio" },
  { id: "hard", label: "Difícil" },
];

function StartMenu() {
  const navigate = useNavigate();
  const prior = typeof window !== "undefined" ? loadSession() : null;
  const [name, setName] = useState(prior?.name ?? "");
  const [difficulty, setDifficulty] = useState<Difficulty | "">(prior?.difficulty ?? "");
  const [errors, setErrors] = useState<{ name?: string; difficulty?: string }>({});

  function handleStart(e: React.FormEvent) {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!name.trim()) errs.name = "Por favor, digite seu nome";
    if (!difficulty) errs.difficulty = "Escolha uma dificuldade";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    saveSession({ name: name.trim(), difficulty: difficulty as Difficulty, score: 0 });
    navigate({ to: "/play" });
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md text-center">
        <header className="mb-12">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
            01 — Início
          </div>
          <h1 className="font-mono text-4xl font-medium tracking-tight text-foreground">
            CodeQuest<span className="text-accent">.</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Preveja a saída de dez trechos de código. Uma rodada, uma pontuação.
          </p>
        </header>

        <form onSubmit={handleStart} className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="name" className="block text-center font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
              Nome
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              maxLength={40}
              className="h-11 rounded-none border-0 border-b border-border bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:border-foreground text-base text-center"
            />
            {errors.name && <p className="text-destructive text-xs font-mono">{errors.name}</p>}
          </div>

          <div className="space-y-3">
            <Label className="block text-center font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
              Dificuldade
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {LEVELS.map((l) => {
                const active = difficulty === l.id;
                return (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setDifficulty(l.id)}
                    className={`h-11 font-mono text-sm border transition-colors ${
                      active
                        ? "border-accent text-accent bg-accent/10"
                        : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
                    }`}
                  >
                    {l.label}
                  </button>
                );
              })}
            </div>
            {errors.difficulty && <p className="text-destructive text-xs font-mono">{errors.difficulty}</p>}
          </div>

          <Button
            type="submit"
            className="w-full h-11 rounded-none font-mono text-sm font-normal tracking-wide bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Iniciar jogo →
          </Button>
        </form>
      </div>
    </main>
  );
}
