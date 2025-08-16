import React, { useEffect, useMemo, useState } from "react";
import { FileText, Loader2, Sparkles, X, HelpCircle, BookOpen, Upload, Brain } from "lucide-react";

type SourceType = "topic" | "file";
type ModeType = "diagnostic" | "practice" | "exam";
type DepthType = "quick" | "standard" | "deep";

export default function TopicCheckButton() {
  const [open, setOpen] = useState(false);

  const [source, setSource] = useState<SourceType>("topic");
  const [topic, setTopic] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [mode, setMode] = useState<ModeType>("diagnostic");
  const [depth, setDepth] = useState<DepthType>("standard");

  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  // Close on Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Questions hint based on depth
  const questionsHint = useMemo(() => {
    switch (depth) {
      case "quick": return "10–12 питань";
      case "standard": return "25–30 питань";
      case "deep": return "50+ питань";
    }
  }, [depth]);

  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  }

  const canStart = useMemo(() => {
    if (source === "topic") return topic.trim().length > 2;
    return !!file;
  }, [source, topic, file]);

  // Agent placeholder (will connect DeepSeek Reasoner + backend)
  async function handleStart() {
    if (!canStart) return;
    setBusy(true);
    setStatus(source === "file"
      ? "Завантажую і попередньо індексую файл…"
      : "Будую карту понять за темою…"
    );
    await new Promise(r => setTimeout(r, 800));

    setStatus("Створюю банк запитань (адаптивно за таксономією Блума)…");
    await new Promise(r => setTimeout(r, 900));

    if (mode === "exam") {
      setStatus("Формую екзамен і критерії оцінювання…");
    } else if (mode === "practice") {
      setStatus("Готую практичний режим із підказками та поясненнями…");
    } else {
      setStatus("Готую діагностичне інтерв'ю (адаптивна складність)…");
    }
    await new Promise(r => setTimeout(r, 900));

    setStatus("Демо-режим: сесію ініціалізовано. Підключимо реального агента на наступному кроці.");
    setBusy(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-testid="topic-check-btn"
        className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium shadow-sm ring-1 ring-white/10 hover:ring-white/20 hover:shadow transition active:scale-[0.99] bg-gradient-to-r from-zinc-800 to-zinc-700 text-white"
        aria-label="Topic Check"
        title="Topic Check — діагностика знань по темі або файлу"
      >
        <HelpCircle className="h-4 w-4" />
        Topic Check
        <Sparkles className="h-4 w-4" />
      </button>

      {open && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-zinc-900 shadow-xl ring-1 ring-white/10 text-white">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                <h2 className="text-base font-semibold">Topic Check (Діагностика теми)</h2>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-lg p-2 hover:bg-white/5" aria-label="Закрити">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-5 py-4 space-y-5">
              {/* Source: Topic or File */}
              <fieldset className="space-y-2">
                <legend className="text-sm font-medium">Джерело завдань</legend>
                <div className="flex items-center gap-3 text-sm">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="source"
                      value="topic"
                      checked={source === "topic"}
                      onChange={() => setSource("topic")}
                      className="accent-white"
                    />
                    <BookOpen className="h-4 w-4" /> Тема
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="source"
                      value="file"
                      checked={source === "file"}
                      onChange={() => setSource("file")}
                      className="accent-white"
                    />
                    <FileText className="h-4 w-4" /> Файл (питання лише з цього файлу)
                  </label>
                </div>
              </fieldset>

              {/* Topic input */}
              {source === "topic" && (
                <label className="block text-sm">
                  Тема
                  <input
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Напр.: Лінійна алгебра / React + TypeScript / Фінансова математика"
                    className="mt-1 w-full rounded-xl bg-zinc-800 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-white/20 text-white placeholder-zinc-400"
                  />
                </label>
              )}

              {/* File upload */}
              {source === "file" && (
                <div className="space-y-2">
                  <label className="block text-sm">Навчальний файл</label>
                  <label className="flex items-center justify-between gap-3 rounded-xl bg-zinc-800 px-3 py-2 text-sm ring-1 ring-white/10 hover:ring-white/20 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      <span>{file ? file.name : "Обрати файл… (.pdf, .docx, .txt, .md, .csv)"}</span>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt,.md,.csv"
                      className="hidden"
                      onChange={onPickFile}
                    />
                  </label>
                  <p className="text-xs text-zinc-400">
                    У проді: файл буде повністю проаналізований (розбиття на розділи, виділення понять, контрольні питання).
                  </p>
                </div>
              )}

              {/* Mode and depth */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block text-sm">
                  Режим
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as ModeType)}
                    className="mt-1 w-full rounded-xl bg-zinc-800 px-3 py-2 text-sm ring-1 ring-white/10 focus:ring-white/20 text-white"
                  >
                    <option value="diagnostic">Діагностика (адаптивно)</option>
                    <option value="practice">Практика (з підказками)</option>
                    <option value="exam">Екзамен (без підказок)</option>
                  </select>
                </label>

                <label className="block text-sm">
                  Глибина
                  <select
                    value={depth}
                    onChange={(e) => setDepth(e.target.value as DepthType)}
                    className="mt-1 w-full rounded-xl bg-zinc-800 px-3 py-2 text-sm ring-1 ring-white/10 focus:ring-white/20 text-white"
                  >
                    <option value="quick">Швидко · 10–12</option>
                    <option value="standard">Стандарт · 25–30</option>
                    <option value="deep">Глибоко · 50+</option>
                  </select>
                  <span className="mt-1 block text-[11px] text-zinc-500">≈ {questionsHint}</span>
                </label>
              </div>

              <p className="text-[11px] text-zinc-400">
                Алгоритм: карта понять → банк питань (різні рівні Блума) → адаптивний відбір → пояснення/приклади.
                Для файлів — питання тільки з вмісту файлу.
              </p>

              {status && (
                <div className="rounded-xl bg-zinc-800/60 px-3 py-2 text-xs">{status}</div>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-white/10">
              <div className="text-[11px] text-zinc-400 flex items-center gap-1">
                <Brain className="h-3 w-3" />
                Режим демо • Агент TopicCheck буде під'єднано наступним кроком
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setOpen(false)} className="rounded-xl px-3 py-2 text-sm hover:bg-white/5">
                  Скасувати
                </button>
                <button
                  onClick={handleStart}
                  disabled={!canStart || busy}
                  aria-busy={busy ? "true" : "false"}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium bg-white text-black disabled:opacity-50"
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  {busy ? "Готую…" : "Почати Topic Check"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
