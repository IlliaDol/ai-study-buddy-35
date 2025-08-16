import React, { useState, useEffect } from "react";
import { Brain, Sparkles, X, Loader2 } from "lucide-react";

/**
 * AI Course Generator with DeepSeek Reasoner integration placeholder
 * Creates comprehensive courses with modules, lessons, tests, and methodology
 */
export default function AICourseGeneratorButton() {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<null | string>(null);

  // Close modal on Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Future DeepSeek Reasoner agent placeholder
  async function handleGenerate() {
    if (!topic.trim()) return;
    setBusy(true);
    setStatus("Підготовка агента… (DeepSeek Reasoner)");
    
    // TODO: Real pipeline will include:
    // 1) Analyze thousands of courses and methodologies
    // 2) Call /api/course/generate -> DeepSeek Reasoner
    // 3) Generate comprehensive package: modules, lessons, tests, tables/files, final exam
    // 4) Structure like Coursera/Udemy: learn -> practice -> test -> learn -> final test
    
    await new Promise((r) => setTimeout(r, 1500)); // Simulate "deep thinking"
    setStatus("Аналізую тисячі курсів та методик навчання...");
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("Створюю структуру курсу за принципами таксономії Блума...");
    await new Promise((r) => setTimeout(r, 1000));
    setStatus("Генерую модулі, уроки, тести та додаткові матеріали...");
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("Демо-режим: агент під'єднано. Повну генерацію підключимо наступним кроком.");
    setBusy(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-testid="ai-course-generator-btn"
        className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium shadow-sm ring-1 ring-white/10 hover:ring-white/20 hover:shadow transition active:scale-[0.99] bg-gradient-to-r from-zinc-800 to-zinc-700 text-white"
        aria-label="AI Course Generator"
      >
        <Brain className="h-4 w-4" />
        AI Course Generator
        <Sparkles className="h-4 w-4" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        >
          <div className="w-full max-w-lg rounded-2xl bg-zinc-900 shadow-xl ring-1 ring-white/10 text-white">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                <h2 className="text-base font-semibold">AI Course Generator</h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 hover:bg-white/5"
                aria-label="Закрити"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-5 py-4 space-y-4">
              <label className="block text-sm">
                Тема курсу
                <input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Напр.: Лінійна алгебра з нуля / React + TypeScript / Фінансова математика"
                  className="mt-1 w-full rounded-xl bg-zinc-800 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-white/20 text-white placeholder-zinc-400"
                />
              </label>

              <p className="text-xs text-zinc-400">
                План: модулі → уроки → практики → тести після розділів → фінальний іспит.
                Додатково: таблиці для навчання, чеклісти, домашки, методика (таксономія Блума).
              </p>

              {status && (
                <div className="rounded-xl bg-zinc-800/60 px-3 py-2 text-xs">
                  {status}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-white/10">
              <div className="text-[11px] text-zinc-400">
                Режим демо • DeepSeek Reasoner (підключимо на наступному кроці)
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2 text-sm hover:bg-white/5"
                >
                  Скасувати
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={busy || !topic.trim()}
                  aria-busy={busy ? "true" : "false"}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium bg-white text-black disabled:opacity-50"
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  {busy ? "Думаю…" : "Згенерувати (DeepThink)"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
