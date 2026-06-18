import type { Difficulty } from "./questions";

export interface GameSession {
  name: string;
  difficulty: Difficulty;
  score: number;
  currentIndex?: number;
  finished?: boolean;
}

export interface RankingEntry {
  name: string;
  difficulty: Difficulty;
  score: number;
  date: number;
}

const KEY = "codequest:session";
const RANK_KEY = "codequest:ranking";

export function saveSession(s: GameSession) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function loadSession(): GameSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}

export function loadRanking(): RankingEntry[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(RANK_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

/**
 * Adds an entry to the global ranking, keeping only the best score per player name.
 * Returns the updated ranking, sorted descending by score.
 */
export function addToRanking(entry: RankingEntry): RankingEntry[] {
  if (typeof window === "undefined") return [];
  const list = loadRanking();
  const key = entry.name.trim().toLowerCase();
  const existingIdx = list.findIndex((e) => e.name.trim().toLowerCase() === key);

  if (existingIdx === -1) {
    list.push(entry);
  } else if (entry.score > list[existingIdx].score) {
    list[existingIdx] = entry;
  }

  list.sort((a, b) => b.score - a.score || a.date - b.date);
  localStorage.setItem(RANK_KEY, JSON.stringify(list));
  return list;
}

export function getTopForPlayer(name: string, limit = 3): RankingEntry[] {
  return loadRanking()
    .filter((e) => e.name.toLowerCase() === name.toLowerCase())
    .slice(0, limit);
}
