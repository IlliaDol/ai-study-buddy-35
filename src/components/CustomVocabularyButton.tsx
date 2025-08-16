import { useEffect, useMemo, useState } from "react";
import { ListPlus, Sparkles, X, Loader2, BookOpenCheck, Save, Trash2 } from "lucide-react";

type Lang = "Ukrainian"|"English"|"German"|"Polish"|"Spanish"|"French"|"Italian";

type VocabItem = {
  id: string;
  term: string;
  translation: string;
  pos?: string;
  example?: string;
  note?: string;
};

const LS_KEY = "cv_decks_v1";

function uid() { return Math.random().toString(36).slice(2,10); }

export default function CustomVocabularyButton() {
  const [open, setOpen] = useState(false);

  const [sourceLang, setSourceLang] = useState<Lang>("Ukrainian");
  const [targetLang, setTargetLang] = useState<Lang>("German");

  const [bulkText, setBulkText] = useState("");
  const [items, setItems] = useState<VocabItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string|null>(null);

  // Decks in localStorage (by language pair)
  const allDecks = useMemo<Record<string, VocabItem[]>>(()=> {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || "{}"); } catch { return {}; }
  }, [open]); // Update when opening
  const currentKey = `${sourceLang}->${targetLang}`;
  const existing = allDecks[currentKey] || [];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function saveDeck(list: VocabItem[]) {
    const cloned = { ...(JSON.parse(localStorage.getItem(LS_KEY) || "{}")) };
    cloned[currentKey] = list;
    localStorage.setItem(LS_KEY, JSON.stringify(cloned));
  }

  function removeItem(id: string) {
    const next = items.filter(x=>x.id!==id);
    setItems(next);
  }

  // DEMO translation: placeholder (will connect to dictionaries/Reasoner on backend)
  async function translateTerms(terms: string[]): Promise<VocabItem[]> {
    // TODO: /api/translate → authoritative dictionaries (Cambridge/Duden/Collins) + frequency variants.
    await new Promise(r=>setTimeout(r, 600));
    return terms.map(t => ({
      id: uid(),
      term: t,
      translation: "— тимчасовий переклад —", // Placeholder; real translation will come from dictionaries/AI
      pos: "",
      example: "",
      note: ""
    }));
  }

  async function handleProcess() {
    const raw = bulkText.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
    const dedup = Array.from(new Set(raw)).slice(0, 500);
    if (!dedup.length) return;

    setBusy(true);
    setStatus("Аналізую терміни, перевіряю варіанти перекладу…");
    await new Promise(r=>setTimeout(r, 800));
    setStatus("Консультуюся з авторитетними словниками (Cambridge, Duden, Collins)…");
    await new Promise(r=>setTimeout(r, 900));
    setStatus("Підбираю найвлучніші та найчастотніші переклади…");
    const translated = await translateTerms(dedup);
    setItems(translated);
    setBusy(false);
    setStatus("Тимчасово: додано переклади-заглушки. Реальні підключимо до словників/AI.");
  }

  function handleSaveToDeck() {
    const merged = mergeUnique(existing, items);
    saveDeck(merged);
    setStatus(`Збережено ${items.length} до словника (${currentKey}).`);
  }

  function mergeUnique(a: VocabItem[], b: VocabItem[]) {
    const map = new Map<string,VocabItem>();
    [...a, ...b].forEach(it => map.set(it.term.toLowerCase(), it));
    return Array.from(map.values());
  }

  return (
    <>
      <button
        type="button"
        onClick={()=>setOpen(true)}
        data-testid="custom-vocab-btn"
        className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium shadow-sm ring-1 ring-white/10 hover:ring-white/20 hover:shadow transition active:scale-[0.99] bg-gradient-to-r from-zinc-800 to-zinc-700 text-white"
        aria-label="Custom Vocabulary"
        title="Custom Vocabulary — ваш персональний словник"
      >
        <ListPlus className="h-4 w-4" />
        Custom Vocabulary
        <Sparkles className="h-4 w-4" />
      </button>

      {open && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-zinc-900 shadow-xl ring-1 ring-white/10 text-white">
            {/* header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <BookOpenCheck className="h-5 w-5" />
                <h2 className="text-base font-semibold">Custom Vocabulary (ваші слова → найвлучніші переклади)</h2>
              </div>
              <button onClick={()=>setOpen(false)} className="rounded-lg p-2 hover:bg-white/5" aria-label="Закрити">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* body */}
            <div className="px-5 py-4 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className="block text-sm">
                  З мови
                  <select value={sourceLang as string} onChange={e=>setSourceLang(e.target.value as Lang)}
                          className="mt-1 w-full rounded-xl bg-zinc-800 px-3 py-2 text-sm ring-1 ring-white/10 focus:ring-white/20 text-white">
                    {["Ukrainian","English","German","Polish","Spanish","French","Italian"].map(l=>(
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm">
                  На мову
                  <select value={targetLang as string} onChange={e=>setTargetLang(e.target.value as Lang)}
                          className="mt-1 w-full rounded-xl bg-zinc-800 px-3 py-2 text-sm ring-1 ring-white/10 focus:ring-white/20 text-white">
                    {["German","English","Ukrainian","Polish","Spanish","French","Italian"].map(l=>(
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </label>

                <div className="text-[11px] text-zinc-500 self-end">
                  У проді: підбір перекладу за частотністю/реєстром + приклади з корпусів.
                </div>
              </div>

              <label className="block text-sm">
                Ваші слова/фрази (по одному на рядок)
                <textarea
                  value={bulkText}
                  onChange={e=>setBulkText(e.target.value)}
                  placeholder="напр. Ausweis&#10;Sprichwort&#10;beantragen&#10;Anmeldung&#10;mitternachts"
                  rows={5}
                  className="mt-1 w-full rounded-xl bg-zinc-800 px-3 py-2 text-sm ring-1 ring-white/10 focus:ring-white/20 text-white placeholder-zinc-400"
                />
              </label>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleProcess}
                  disabled={busy || !bulkText.trim()}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium bg-white text-black disabled:opacity-50"
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  {busy ? "Підбираю переклади…" : "Згенерувати переклад(и)"}
                </button>
                <button
                  onClick={handleSaveToDeck}
                  disabled={!items.length}
                  className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm ring-1 ring-white/10 hover:ring-white/20"
                >
                  <Save className="h-4 w-4" />
                  Зберегти у словник
                </button>
              </div>

              {!!items.length && (
                <div className="rounded-xl ring-1 ring-white/10 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-zinc-800/50 text-zinc-300">
                      <tr>
                        <th className="px-3 py-2 text-left w-[20%]">Термін</th>
                        <th className="px-3 py-2 text-left w-[25%]">Переклад</th>
                        <th className="px-3 py-2 text-left w-[10%]">Част.</th>
                        <th className="px-3 py-2 text-left">Приклад</th>
                        <th className="px-3 py-2 text-left w-[20%]">Нотатка</th>
                        <th className="px-3 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map(it=>(
                        <tr key={it.id} className="border-t border-white/5">
                          <td className="px-3 py-2">
                            <input value={it.term} onChange={e=>setItems(prev=>prev.map(x=>x.id===it.id?{...x, term:e.target.value}:x))}
                                   className="w-full rounded bg-zinc-800 px-2 py-1 ring-1 ring-white/10 text-white" />
                          </td>
                          <td className="px-3 py-2">
                            <input value={it.translation} onChange={e=>setItems(prev=>prev.map(x=>x.id===it.id?{...x, translation:e.target.value}:x))}
                                   className="w-full rounded bg-zinc-800 px-2 py-1 ring-1 ring-white/10 text-white" />
                          </td>
                          <td className="px-3 py-2">
                            <input value={it.pos||""} onChange={e=>setItems(prev=>prev.map(x=>x.id===it.id?{...x, pos:e.target.value}:x))}
                                   placeholder="імен., дієсл.…" className="w-full rounded bg-zinc-800 px-2 py-1 ring-1 ring-white/10 text-white placeholder-zinc-500" />
                          </td>
                          <td className="px-3 py-2">
                            <input value={it.example||""} onChange={e=>setItems(prev=>prev.map(x=>x.id===it.id?{...x, example:e.target.value}:x))}
                                   placeholder="приклад речення" className="w-full rounded bg-zinc-800 px-2 py-1 ring-1 ring-white/10 text-white placeholder-zinc-500" />
                          </td>
                          <td className="px-3 py-2">
                            <input value={it.note||""} onChange={e=>setItems(prev=>prev.map(x=>x.id===it.id?{...x, note:e.target.value}:x))}
                                   placeholder="стиль/реєстр/сленг" className="w-full rounded bg-zinc-800 px-2 py-1 ring-1 ring-white/10 text-white placeholder-zinc-500" />
                          </td>
                          <td className="px-3 py-2 text-right">
                            <button onClick={()=>removeItem(it.id)} className="rounded p-2 hover:bg-white/5" aria-label="Видалити">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* status */}
              {status && <div className="rounded-xl bg-zinc-800/60 px-3 py-2 text-xs">{status}</div>}
            </div>

            {/* footer */}
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-white/10">
              <div className="text-[11px] text-zinc-400">
                Експериментально: реальний переклад отримаємо з авторитетних словників/корпусів (Cambridge/Duden/Collins/Reverso) через бекенд.
              </div>
              <button onClick={()=>setOpen(false)} className="rounded-xl px-3 py-2 text-sm hover:bg-white/5">Готово</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
