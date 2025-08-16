import { useCallback } from 'react';
import { getSrsMap, setSrsMap, SrsCardState } from './localStorage';
import { track } from '@/lib/analytics';

function nowMs() { return Date.now(); }

function calcNext(prev: SrsCardState | undefined, grade: 'again'|'hard'|'good'|'easy'): SrsCardState {
  const base: SrsCardState = prev || { ease: 2.3, intervalDays: 0, nextReviewAt: nowMs(), totalReviews: 0 };
  let ease = base.ease;
  if (grade === 'again') ease = Math.max(1.3, ease - 0.2);
  if (grade === 'hard') ease = Math.max(1.3, ease - 0.05);
  if (grade === 'easy') ease = ease + 0.15;
  let interval = 0;
  if (!prev || base.intervalDays === 0) interval = grade === 'again' ? 0 : 1;
  else if (base.intervalDays === 1) interval = grade === 'again' ? 0 : Math.round(6 * ease);
  else interval = Math.max(1, Math.round(base.intervalDays * ease));
  const next = new Date();
  next.setDate(next.getDate() + interval);
  return {
    ease,
    intervalDays: interval,
    nextReviewAt: next.getTime(),
    totalReviews: (base.totalReviews || 0) + 1,
    lastResult: grade,
  };
}

export function useSRS() {
  const review = useCallback((cardKey: string, grade: 'again'|'hard'|'good'|'easy') => {
    const map = getSrsMap();
    const next = calcNext(map[cardKey], grade);
    map[cardKey] = next;
    setSrsMap(map);
    
    // Track SRS review
    track('srs_review', {
      card_key: cardKey,
      grade: grade,
      new_interval: next.intervalDays,
      ease_factor: next.ease,
      total_reviews: next.totalReviews
    });
    
    return next;
  }, []);

  const dueCards = useCallback((cardKeys: string[]) => {
    const map = getSrsMap();
    const now = nowMs();
    return cardKeys.filter(k => !map[k] || map[k].nextReviewAt <= now);
  }, []);

  return { review, dueCards };
}
