export type SavedDeck = {
  id: string;
  title: string;
  createdAt: number;
  flashcards: Array<{ front: string; back: string; id?: string }>;
  quizQuestions: Array<{ question: string; options: string[]; correctAnswer: number; explanation?: string }>;
};

export type GamificationState = {
  xp: number;
  streakCount: number;
  lastActiveDate: string | null; // YYYY-MM-DD
};

export type SrsCardState = {
  ease: number; // e.g., 2.3
  intervalDays: number; // next interval length
  nextReviewAt: number; // timestamp ms
  totalReviews: number;
  lastResult?: 'again' | 'hard' | 'good' | 'easy';
};

const KEY_PREFIX = 'ai-study-buddy';

function k(name: string) {
  return `${KEY_PREFIX}:${name}`;
}

export function getJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(k(key));
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setJSON<T>(key: string, value: T): void {
  try {
    localStorage.setItem(k(key), JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function getSavedDecks(): SavedDeck[] {
  return getJSON<SavedDeck[]>('savedDecks', []);
}

export function saveDeck(deck: SavedDeck): void {
  const decks = getSavedDecks();
  const idx = decks.findIndex(d => d.id === deck.id);
  if (idx >= 0) decks[idx] = deck; else decks.unshift(deck);
  setJSON('savedDecks', decks);
}

export function deleteDeck(deckId: string): void {
  const decks = getSavedDecks().filter(d => d.id !== deckId);
  setJSON('savedDecks', decks);
}

export function getGamification(): GamificationState {
  return getJSON<GamificationState>('gamification', { xp: 0, streakCount: 0, lastActiveDate: null });
}

export function setGamification(state: GamificationState): void {
  setJSON('gamification', state);
  window.dispatchEvent(new CustomEvent('gamification:update'));
}

export function getSrsMap(): Record<string, SrsCardState> {
  return getJSON<Record<string, SrsCardState>>('srsMap', {});
}

export function setSrsMap(map: Record<string, SrsCardState>): void {
  setJSON('srsMap', map);
}