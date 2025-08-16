import React, { useState, useEffect } from "react";
import { Brain, Sparkles, X, Loader2, ListChecks } from "lucide-react";
import { generateCourseFactory } from "../services/courseFactory";
import type { Syllabus } from "../schemas/course";

/**
 * AI Course Generator with DeepSeek Reasoner integration placeholder
 * Creates comprehensive courses with modules, lessons, tests, and methodology
 */
export default function AICourseGeneratorButton() {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<null | string>(null);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [syllabus, setSyllabus] = useState<Syllabus | null>(null);

  // Close modal on Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Minimal stubbed pipeline call
  async function handleGenerate() {
    if (!topic.trim()) return;
    setBusy(true);
    setStatuses([]);
    setSyllabus(null);
    setStatus("Запускаю конвеєр контенту…");

    try {
      const result = await generateCourseFactory({
        topic: topic.trim(),
        language: "uk",
        level: "beginner",
        goals: [],
      });
      setStatuses(result.statuses);
      setSyllabus(result.syllabus);
      setStatus("Готово: силлабус згенеровано (демо)");
    } catch (e: any) {
      console.error(e);
      setStatus(e?.message || "Помилка генерації");
    } finally {
      setBusy(false);
    }
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

              {statuses.length > 0 && (
                <div className="rounded-xl bg-zinc-800/40 px-3 py-2 text-xs space-y-1">
                  <div className="flex items-center gap-2 font-medium text-zinc-300">
                    <ListChecks className="h-3.5 w-3.5" /> Етапи конвеєра
                  </div>
                  <ul className="list-disc pl-5 space-y-0.5 text-zinc-400">
                    {statuses.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {syllabus && (
                <div className="rounded-xl bg-zinc-800/30 px-3 py-2 text-xs">
                  <div className="font-semibold text-zinc-200">Силлабус (демо)</div>
                  <div className="text-zinc-300 mt-1">{syllabus.title}</div>
                  <div className="mt-2 grid grid-cols-1 gap-2">
                    {syllabus.modules.slice(0, 2).map((m, idx) => (
                      <div key={idx} className="rounded-lg bg-zinc-900/40 p-2">
                        <div className="font-medium text-zinc-200">{m.title}</div>
                        <div className="text-zinc-400">Уроків: {m.lessons.length}</div>
                        {m.lessons.slice(0, 1).map((l) => (
                          <div key={l.id} className="mt-1">
                            <div className="text-zinc-300">• {l.title}</div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
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
