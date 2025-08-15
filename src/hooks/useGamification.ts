import { useEffect, useState, useCallback } from 'react';
import { getGamification, setGamification, GamificationState } from './localStorage';

function todayStr(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export function useGamification() {
  const [state, setState] = useState<GamificationState>(() => getGamification());

  useEffect(() => {
    const onUpdate = () => setState(getGamification());
    window.addEventListener('gamification:update', onUpdate);
    return () => window.removeEventListener('gamification:update', onUpdate);
  }, []);

  const touchDayAndGainXP = useCallback((xpDelta: number) => {
    const now = todayStr();
    const s = getGamification();
    if (s.lastActiveDate !== now) {
      // new day
      const wasYesterday = s.lastActiveDate && isYesterday(s.lastActiveDate);
      s.streakCount = wasYesterday ? (s.streakCount || 0) + 1 : 1;
      s.lastActiveDate = now;
    }
    s.xp = (s.xp || 0) + xpDelta;
    setGamification(s);
    setState(s);
  }, []);

  return {
    xp: state.xp || 0,
    streak: state.streakCount || 0,
    lastActiveDate: state.lastActiveDate,
    gainXP: touchDayAndGainXP,
  };
}

function isYesterday(yyyyMmDd: string): boolean {
  try {
    const then = new Date(yyyyMmDd + 'T00:00:00Z');
    const now = new Date();
    const diff = now.getTime() - then.getTime();
    const oneDay = 24 * 60 * 60 * 1000;
    return diff > 0 && diff < 2 * oneDay && now.getUTCDate() - then.getUTCDate() === 1 ||
      new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString().slice(0,10) === yyyyMmDd;
  } catch {
    return false;
  }
}