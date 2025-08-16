import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LoadingBlock } from '../components/LoadingBlock';
import { ErrorBlock } from '../components/ErrorBlock';
import { useSRS } from '../hooks/useSRS';

interface ReviewCard {
  id: string;
  front: string;
  back: string;
}

export default function Review() {
  const { t } = useTranslation();
  const { state, actions } = useSRS();
  const [flipped, setFlipped] = useState(false);

  const due = useMemo(() => state.cards.filter(c => new Date(c.dueDate) <= new Date()), [state.cards]);
  const current = due[0];

  if (state.loading) return <LoadingBlock label={t('review.loading')} />;
  if (state.error) return <ErrorBlock label={t('review.error')} description={String(state.error)} />;

  if (!current) {
    return (
      <div className="mx-auto max-w-xl p-6">
        <div className="text-2xl font-semibold">{t('review.empty.title')}</div>
        <div className="text-slate-600 dark:text-slate-300 mt-2">{t('review.empty.subtitle')}</div>
      </div>
    );
  }

  function grade(n: number) {
    actions.grade(current.id, n);
    setFlipped(false);
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <div className="text-sm text-slate-500 mb-2">{t('review.dueCount', { count: due.length })}</div>
      <div className="border rounded-2xl p-6 bg-white dark:bg-slate-800 shadow-sm">
        <div className="text-slate-400 text-xs mb-2">{current.id}</div>
        <div className="text-xl font-semibold mb-3">{flipped ? current.back : current.front}</div>
        <div className="flex gap-2">
          {!flipped ? (
            <button onClick={() => setFlipped(true)} className="px-3 py-2 rounded-lg bg-slate-900 text-white">
              {t('review.actions.showAnswer')}
            </button>
          ) : (
            <>
              <button onClick={() => grade(1)} className="px-3 py-2 rounded-lg bg-rose-600 text-white">1</button>
              <button onClick={() => grade(2)} className="px-3 py-2 rounded-lg bg-orange-600 text-white">2</button>
              <button onClick={() => grade(3)} className="px-3 py-2 rounded-lg bg-amber-600 text-white">3</button>
              <button onClick={() => grade(4)} className="px-3 py-2 rounded-lg bg-emerald-600 text-white">4</button>
              <button onClick={() => grade(5)} className="px-3 py-2 rounded-lg bg-blue-600 text-white">5</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
