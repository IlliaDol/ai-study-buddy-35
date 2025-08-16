import { useEffect, useMemo, useState } from "react";
import { Languages, Sparkles, X, Loader2, Brain, Upload, BookOpen } from "lucide-react";

type CEFR = "A1"|"A2"|"B1"|"B2"|"C1"|"C2";
type Mode = "lesson"|"practice"|"exam"|"conversation";
type Skill = "vocab"|"grammar"|"reading"|"listening"|"writing";

export default function LanguageLabButton() {
  const [open, setOpen] = useState(false);

  // Basic settings
  const [studyLang, setStudyLang] = useState("German");     // Language being learned
  const [nativeLang, setNativeLang] = useState("Ukrainian"); // Base language for explanations/translation
  const [level, setLevel] = useState<CEFR>("A1");
  const [mode, setMode] = useState<Mode>("lesson");
  const [skills, setSkills] = useState<Skill[]>(["vocab","grammar","reading","writing"]);

  // Topics/context
  const [topics, setTopics] = useState("");
  const [useFileCorpus, setUseFileCorpus] = useState(false);
  const [file, setFile] = useState<File|null>(null);

  // Session parameters
  const [depth, setDepth] = useState<"quick"|"standard"|"deep">("standard");
  const qHint = useMemo(() => depth==="quick" ? "≈ 10–12 завдань" : depth==="deep" ? "≈ 50+ завдань" : "≈ 25–30 завдань", [depth]);

  // Agent states (demo)
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string|null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function toggleSkill(s: Skill) {
    setSkills(prev => prev.includes(s) ? prev.filter(x=>x!==s) : [...prev, s]);
  }

  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (f) setFile(f);
  }

  const canStart = useMemo(() => {
    if (useFileCorpus) return !!file;
    return (studyLang && nativeLang && studyLang!==nativeLang);
  }, [useFileCorpus, file, studyLang, nativeLang]);

  async function handleStart() {
    if (!canStart) return;
    setBusy(true);
    setStatus("Готую агента LanguageLab… (рівень, навички, цілі)");
    await new Promise(r=>setTimeout(r,800));

    if (useFileCorpus) {
      setStatus("Індексація вашого файлу як навчального корпусу… (уривки → завдання)");
      await new Promise(r=>setTimeout(r,900));
    } else {
      setStatus("Будую карту тем і частотну лексику для рівня " + level + "…");
      await new Promise(r=>setTimeout(r,900));
    }

    setStatus("Проєктую набір блоків: міні-урок → практика → тест; адаптивний добір завдань…");
    await new Promise(r=>setTimeout(r,900));

    switch (mode) {
      case "lesson": setStatus("Створюю міні-уроки: пояснення + приклади + короткі вправи…"); break;
      case "practice": setStatus("Готую практику з підказками та миттєвими поясненнями…"); break;
      case "exam": setStatus("Формую екзамен без підказок із рубриками оцінювання…"); break;
      case "conversation": setStatus("Готую діалогові сценарії та рольові карти…"); break;
    }
    await new Promise(r=>setTimeout(r,900));

    setStatus("Демо-режим: сесію ініціалізовано. Підключимо реального агента на наступному кроці.");
    setBusy(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={()=>setOpen(true)}
        data-testid="language-lab-btn"
        className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium shadow-sm ring-1 ring-white/10 hover:ring-white/20 hover:shadow transition active:scale-[0.99] bg-gradient-to-r from-zinc-800 to-zinc-700 text-white"
        aria-label="Language Lab"
        title="Language Lab — адаптивне вивчення мов"
      >
        <Languages className="h-4 w-4" />
        Language Lab
        <Sparkles className="h-4 w-4" />
      </button>

      {open && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-zinc-900 shadow-xl ring-1 ring-white/10 text-white">
            {/* header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Languages className="h-5 w-5" />
                <h2 className="text-base font-semibold">Language Lab (мова + рівень + навички)</h2>
              </div>
              <button onClick={()=>setOpen(false)} className="rounded-lg p-2 hover:bg-white/5" aria-label="Закрити">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* body */}
            <div className="px-5 py-4 space-y-5">
              {/* Languages */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className="block text-sm">
                  Мова навчання
                  <select value={studyLang} onChange={e=>setStudyLang(e.target.value)}
                          className="mt-1 w-full rounded-xl bg-zinc-800 px-3 py-2 text-sm ring-1 ring-white/10 focus:ring-white/20 text-white">
                    {["German","English","Spanish","French","Italian","Polish","Ukrainian"].map(l=>(
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm">
                  Базова мова (пояснення)
                  <select value={nativeLang} onChange={e=>setNativeLang(e.target.value)}
                          className="mt-1 w-full rounded-xl bg-zinc-800 px-3 py-2 text-sm ring-1 ring-white/10 focus:ring-white/20 text-white">
                    {["Ukrainian","English","German","Polish","Russian"].map(l=>(
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm">
                  Рівень (CEFR)
                  <select value={level} onChange={e=>setLevel(e.target.value as CEFR)}
                          className="mt-1 w-full rounded-xl bg-zinc-800 px-3 py-2 text-sm ring-1 ring-white/10 focus:ring-white/20 text-white">
                    {["A1","A2","B1","B2","C1","C2"].map(l=>(
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </label>
              </div>

              {/* Mode + depth */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className="block text-sm">
                  Режим
                  <select value={mode} onChange={e=>setMode(e.target.value as Mode)}
                          className="mt-1 w-full rounded-xl bg-zinc-800 px-3 py-2 text-sm ring-1 ring-white/10 focus:ring-white/20 text-white">
                    <option value="lesson">Міні-уроки</option>
                    <option value="practice">Практика</option>
                    <option value="exam">Екзамен</option>
                    <option value="conversation">Діалог</option>
                  </select>
                </label>

                <label className="block text-sm sm:col-span-2">
                  Глибина сесії
                  <select value={depth} onChange={e=>setDepth(e.target.value as any)}
                          className="mt-1 w-full rounded-xl bg-zinc-800 px-3 py-2 text-sm ring-1 ring-white/10 focus:ring-white/20 text-white">
                    <option value="quick">Швидко · 10–12</option>
                    <option value="standard">Стандарт · 25–30</option>
                    <option value="deep">Глибоко · 50+</option>
                  </select>
                  <span className="mt-1 block text-[11px] text-zinc-500">{qHint}</span>
                </label>
              </div>

              {/* Skills */}
              <div className="text-sm">
                Навички
                <div className="mt-2 flex flex-wrap gap-2">
                  {[
                    ["vocab","Лексика"],
                    ["grammar","Граматика"],
                    ["reading","Читання"],
                    ["listening","Аудіювання"],
                    ["writing","Письмо"],
                  ].map(([k,label])=>(
                    <button key={k}
                      type="button"
                      onClick={()=>toggleSkill(k as Skill)}
                      className={`rounded-full px-3 py-1 ring-1 ring-white/10 transition-colors ${skills.includes(k as Skill)? "bg-white text-black":"bg-zinc-800 hover:ring-white/20"}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topics / corpus */}
              <div className="space-y-3">
                <label className="block text-sm">
                  Теми (через кому)
                  <input
                    value={topics}
                    onChange={e=>setTopics(e.target.value)}
                    placeholder="напр.: подорожі, університет, банківські послуги"
                    className="mt-1 w-full rounded-xl bg-zinc-800 px-3 py-2 text-sm ring-1 ring-white/10 focus:ring-white/20 text-white placeholder-zinc-400"
                  />
                  <span className="mt-1 block text-[11px] text-zinc-500">Впливає на лексику, приклади та завдання.</span>
                </label>

                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="accent-white" checked={useFileCorpus} onChange={e=>setUseFileCorpus(e.target.checked)} />
                  Використати мій файл як навчальний корпус
                </label>

                {useFileCorpus && (
                  <label className="flex items-center justify-between gap-3 rounded-xl bg-zinc-800 px-3 py-2 text-sm ring-1 ring-white/10 hover:ring-white/20 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      <span>{file ? file.name : "Обрати файл… (.pdf, .docx, .txt, .md, .csv)"}</span>
                    </div>
                    <input type="file" accept=".pdf,.doc,.docx,.txt,.md,.csv" className="hidden" onChange={onPickFile}/>
                  </label>
                )}
                <p className="text-[11px] text-zinc-400">
                  Агент підбиратиме завдання за рівнем {level}, робитиме пояснення {nativeLang}→{studyLang}, а переклад — залежно від напрямку.
                </p>
              </div>

              {status && <div className="rounded-xl bg-zinc-800/60 px-3 py-2 text-xs">{status}</div>}
            </div>

            {/* footer */}
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-white/10">
              <div className="text-[11px] text-zinc-400 flex items-center gap-1">
                <Brain className="h-3 w-3" />
                Демо • LanguageLab Agent (під'єднаємо Reasoner/бекенд)
              </div>
              <div className="flex items-center gap-2">
                <button onClick={()=>setOpen(false)} className="rounded-xl px-3 py-2 text-sm hover:bg-white/5">Скасувати</button>
                <button
                  onClick={handleStart}
                  disabled={!canStart || busy}
                  aria-busy={busy ? "true":"false"}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium bg-white text-black disabled:opacity-50"
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin"/> : <Sparkles className="h-4 w-4" />}
                  {busy ? "Готую сесію…" : "Почати Language Lab"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
