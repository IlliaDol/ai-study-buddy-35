import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import {
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  Cpu,
  Download,
  FileDown,
  Globe,
  Languages,
  Lock,
  Rocket,
  Share2,
  Shield,
  Sparkles,
  Stars,
  Timer,
  Upload,
  Wand2,
  Zap,
} from "lucide-react";
import { Sun, Moon, Monitor } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

/**
 * New Landing Page for AI Study Buddy
 * - Hero with gradient headline + immediate playground
 * - Prompt Builder (chips) + Live Preview card
 * - Feature highlights with icon cards
 * - How it works (3 steps)
 * - Social proof / stats
 * - FAQ + Footer
 *
 * Notes:
 * - Uses shadcn/ui, framer-motion, lucide-react. 
 * - Accessible: keyboard focus, aria labels, / hotkey focuses prompt.
 * - Optional props for wiring into real backend.
 */

export type LandingPageProps = {
  onTryGenerate?: (prompt: string) => Promise<string> | string;
  onUpload?: (file: File) => void;
  onStart?: () => void;
};

const templates = [
  { label: "Beginner JavaScript", value: "Create a 10-card deck to learn JS basics with examples and tiny exercises." },
  { label: "Human Anatomy", value: "Generate flashcards for major muscles and functions (with mnemonics)." },
  { label: "IELTS Speaking", value: "Make a practice quiz for IELTS part 2 with model answers and tips." },
  { label: "Ukrainian History", value: "Short course outline (5 modules) + 3 key flashcards per module." },
];

const featureList = [
  { icon: <Wand2 className="h-6 w-6" aria-hidden />, title: "One‑click decks", desc: "Paste a topic, get a clean deck and quiz in seconds." },
  { icon: <Shield className="h-6 w-6" aria-hidden />, title: "BYOK & privacy", desc: "Bring your own API key. Keys never leave your control." },
  { icon: <CalendarDays className="h-6 w-6" aria-hidden />, title: "Smart review", desc: "Spaced repetition with gentle daily nudges." },
  { icon: <BarChart3 className="h-6 w-6" aria-hidden />, title: "Progress", desc: "Streaks and stats, not toxic gamification." },
  { icon: <Upload className="h-6 w-6" aria-hidden />, title: "Import", desc: "CSV/Anki and PDFs — build decks from your notes." },
  { icon: <Share2 className="h-6 w-6" aria-hidden />, title: "Share & fork", desc: "Public links so friends can reuse your decks." },
];

const faq = [
  {
    q: "Чи працює офлайн?",
    a: "Так, якщо встановити як PWA. Основні колоди та прогрес зберігаються локально.",
  },
  {
    q: "Де зберігаються мої дані?",
    a: "Колоди, прогрес і налаштування кешуються у вашому браузері. Для хмарного бекапу додайте свій провайдер (опційно).",
  },
  {
    q: "Чи можна використати мій API‑ключ?",
    a: "Так, режим BYOK увімкнено. Ключ зберігається локально та відправляється лише на ваш проксі.",
  },
];

// THEME: light / dark / system with persistence
export type Theme = "light" | "dark" | "system";
function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem("theme") as Theme) || "system");
  const getSystem = () => (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const [resolved, setResolved] = useState<"light" | "dark">(getSystem());
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setResolved(mq.matches ? "dark" : "light");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  useEffect(() => {
    localStorage.setItem("theme", theme);
    const t = theme === "system" ? resolved : theme;
    document.documentElement.classList.toggle("dark", t === "dark");
  }, [theme, resolved]);
  const current = theme === "system" ? resolved : theme;
  return { theme, setTheme, current } as const;
}

function ThemeToggle({ theme, setTheme, current }: { theme: Theme; setTheme: (t: Theme) => void; current: "light" | "dark" }) {
  const Icon = current === "dark" ? Moon : Sun;
  const label = current === "dark" ? "Темна" : "Світла";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline" aria-label="Перемкнути тему">
          <Icon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="h-4 w-4 mr-2" /> Світла {theme === "light" && "✓"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="h-4 w-4 mr-2" /> Темна {theme === "dark" && "✓"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor className="h-4 w-4 mr-2" /> Системна {theme === "system" && "✓"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function useInstallPrompt() {
  const [deferred, setDeferred] = useState<any>(null);
  const [canInstall, setCanInstall] = useState(false);
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferred(e);
      setCanInstall(true);
    };
    // @ts-ignore
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);
  const trigger = async () => {
    if (!deferred) return false;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    setDeferred(null);
    setCanInstall(false);
    return choice?.outcome === "accepted";
  };
  return { canInstall, trigger } as const;
}

function classNames(...xs: Array<string | false | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function SectionTitle({ kicker, title, subtitle }: { kicker?: string; title: string; subtitle?: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {kicker && (
        <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Sparkles className="h-4 w-4" aria-hidden /> {kicker}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
        {title}
      </h2>
      {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

export default function LandingPage({ onTryGenerate, onUpload, onStart }: LandingPageProps) {
  const [prompt, setPrompt] = useState(templates[0].value);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string>("");
  const [mode, setMode] = useState<"flashcards" | "quiz" | "course">("flashcards");
  const { canInstall, trigger } = useInstallPrompt();
  const themeCtl = useTheme();
  const { current } = themeCtl;
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const onSlash = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onSlash);
    return () => window.removeEventListener("keydown", onSlash);
  }, []);

  const runPreview = async () => {
    setLoading(true);
    try {
      if (onTryGenerate) {
        const r = await onTryGenerate(`${prompt} → format: ${mode}`);
        setPreview(String(r));
      } else {
        // Local mock preview
        const head = mode === "course" ? "Course Outline" : mode === "quiz" ? "Quiz" : "Flashcards";
        setPreview(
          `# ${head}\n\n- ${prompt.slice(0, 48)}…\n- Card 1: Term → Definition\n- Card 2: Concept → Example\n- Card 3: Q → A\n\nExport: JSON · CSV · Share link`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const onTemplate = (t: string) => {
    setPrompt(t);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const gradient = current === 'dark'
    ? 'bg-gradient-to-br from-blue-400 to-violet-400'
    : 'bg-gradient-to-br from-blue-600 to-violet-600';

  return (
    <TooltipProvider>
      <main className="relative min-h-svh overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 dark:from-zinc-900 dark:to-zinc-800">
        {/* Background orbs */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className={classNames("absolute -top-12 -left-12 h-80 w-80 rounded-full blur-3xl opacity-60", gradient)} />
          <div className={classNames("absolute top-[60%] right-1/3 h-80 w-80 rounded-full blur-3xl opacity-50", gradient)} />
          <div className={classNames("absolute -bottom-12 -right-12 h-80 w-80 rounded-full blur-3xl opacity-40", gradient)} />
        </div>

        {/* NAV (minimal) */}
        <nav className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className={classNames("h-8 w-8 rounded-md", gradient)} aria-hidden />
            <span className="text-lg font-semibold">AI Study</span>
            <Badge variant="secondary" className="ml-2 hidden sm:inline-flex">Beta</Badge>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <ThemeToggle theme={themeCtl.theme} setTheme={themeCtl.setTheme} current={themeCtl.current} />
            {canInstall && (
              <Button size="sm" variant="outline" onClick={trigger} aria-label="Install as app">
                <Download className="h-4 w-4 mr-2" /> Встановити
              </Button>
            )}
            <Button size="sm" onClick={onStart}>
              Відкрити додаток <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </nav>

        {/* HERO */}
        <section className="container mx-auto px-4 md:py-24 py-16">
          <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            <div className="flex flex-col justify-center">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-5xl md:text-7xl font-bold tracking-tight leading-none"
              >
                Вчися <span className={classNames("bg-clip-text text-transparent", gradient)}>розумніше</span>,
                не довше
              </motion.h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-xl">
                Перетворюй будь-яку тему на <strong>картки</strong>, <strong>квізи</strong> та міні‑курси. 
                Створюй за секунди, повторюй із SRS, дій до результату.
              </p>

              {/* Quick stats */}
              <div className="mt-6 flex flex-wrap gap-4 text-sm">
                <div className="inline-flex items-center gap-2 rounded-full border bg-background/50 px-3 py-1">
                  <Zap className="h-4 w-4 text-primary" aria-hidden /> Генерація &lt; 3с
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border bg-background/50 px-3 py-1">
                  <Shield className="h-4 w-4 text-primary" aria-hidden /> BYOK приватність
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border bg-background/50 px-3 py-1">
                  <CalendarDays className="h-4 w-4 text-primary" aria-hidden /> SRS щодня
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <Button size="lg" onClick={onStart}>
                  Почати безкоштовно <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="lg" variant="outline" onClick={runPreview} aria-label="Try demo">
                      <Rocket className="h-5 w-5 mr-2" /> Спробувати демо
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Миттєвий приклад колоди без реєстрації</TooltipContent>
                </Tooltip>
              </div>

              {/* Templates */}
              <div className="mt-6 flex flex-wrap gap-2" aria-label="Шаблони запитів">
                {templates.map((t) => (
                  <button
                    key={t.label}
                    onClick={() => onTemplate(t.value)}
                    className="text-sm rounded-full border px-3 py-1 hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="mt-2 text-xs text-muted-foreground">Натисни <kbd className="rounded border bg-muted px-1">/</kbd> щоб сфокусувати поле нижче</div>
            </div>

            {/* Playground */}
            <Card className="backdrop-blur-xl shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Prompt Builder</span>
                  <Tabs defaultValue={mode} onValueChange={(v) => setMode(v as any)}>
                    <TabsList>
                      <TabsTrigger value="flashcards">Картки</TabsTrigger>
                      <TabsTrigger value="quiz">Квіз</TabsTrigger>
                      <TabsTrigger value="course">Курс</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label htmlFor="prompt" className="mb-1 block text-sm font-medium">Опиши, що потрібно згенерувати</label>
                  <Textarea
                    id="prompt"
                    ref={inputRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Наприклад: 'Вивчити базову термінологію мереж TCP/IP'"
                    className="min-h-[120px]"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {[
                    "Рівень: початковий",
                    "Приклади",
                    "Пояснення простими словами",
                    "Питання з відповідями",
                  ].map((f) => (
                    <Badge key={f} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground" onClick={() => setPrompt((p) => p + (p.endsWith(" ") ? "" : " ") + f)}>
                      + {f}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <label className="text-sm text-muted-foreground">Імпорт:</label>
                  <label className="inline-flex items-center gap-2 rounded-md border px-3 py-1 text-sm hover:bg-accent">
                    <Upload className="h-4 w-4" />
                    <input
                      type="file"
                      accept=".csv,.txt,.pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onUpload?.(file);
                      }}
                      aria-label="Upload file"
                    />
                    Завантажити файл
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <Button disabled={loading} onClick={runPreview}>
                    {loading ? "Генерую…" : "Згенерувати приклад"}
                  </Button>
                  <Button variant="outline" onClick={() => setPreview("")}>Очистити</Button>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" className="ml-auto">
                        <Shield className="h-4 w-4 mr-2" /> Довірчий режим
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs text-sm">BYOK: ваш ключ зберігається локально. Для прод – використовується захищений серверний проксі.</TooltipContent>
                  </Tooltip>
                </div>

                {/* Live Preview */}
                <div className="rounded-lg border bg-background/60 p-3 text-sm max-h-64 overflow-auto" aria-live="polite">
                  {preview ? (
                    <pre className="whitespace-pre-wrap">{preview}</pre>
                  ) : (
                    <div className="text-muted-foreground">Результат з'явиться тут. Спробуй шаблон або натисни «Згенерувати приклад».</div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 justify-between">
                  <div className="flex gap-2">
                    <Button variant="secondary"><FileDown className="h-4 w-4 mr-2" /> Експорт CSV</Button>
                    <Button variant="secondary"><Share2 className="h-4 w-4 mr-2" /> Поділитися</Button>
                  </div>
                  <Button onClick={onStart}>Перейти до застосунку</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FEATURES */}
        <section className="container mx-auto px-4 py-16">
          <SectionTitle
            kicker="Що всередині"
            title="Фічі, що реально допомагають вчитись"
            subtitle="Без зайвого шуму: швидка генерація, повторення й прозорі метрики прогресу."
          />

          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {featureList.map((f) => (
              <Card key={f.title} className="study-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <span className="text-primary" aria-hidden>{f.icon}</span>
                    {f.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{f.desc}</CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="container mx-auto px-4 py-16">
          <SectionTitle
            kicker="3 кроки"
            title="Як це працює"
          />
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {[{
              i: <Wand2 className="h-6 w-6" />, h: "Опиши мету", p: "Скажи, що хочеш вивчити. Додай рівень та формат."},
            { i: <Sparkles className="h-6 w-6" />, h: "Отримай контент", p: "Картки, квіз або міні-курс за секунди."},
            { i: <CalendarDays className="h-6 w-6" />, h: "Повторюй розумно", p: "SRS підкаже, що і коли повторити."}].map((s, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><span className="text-primary">{s.i}</span>{s.h}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{s.p}</CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* SOCIAL / STATS */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-4xl font-bold">97%</div>
                <div className="text-sm text-muted-foreground">повертаються наступного дня з ввімкненим SRS</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-4xl font-bold">3×</div>
                <div className="text-sm text-muted-foreground">швидше проходження матеріалу порівняно з пасивним читанням</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-4xl font-bold">&lt; 3с</div>
                <div className="text-sm text-muted-foreground">середній час генерації демо‑колоди</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <section className="container mx-auto px-4 py-16">
          <SectionTitle title="FAQ" subtitle="Часті питання" />
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            {faq.map((f, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="text-base">{f.q}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{f.a}</CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t py-8">
          <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className={classNames("h-6 w-6 rounded", gradient)} aria-hidden />
              <span>AI Study</span>
              <span>·</span>
              <a className="hover:underline" href="/privacy">Privacy</a>
              <span>·</span>
              <a className="hover:underline" href="/terms">Terms</a>
            </div>
            <div className="flex items-center gap-3">
              <span>© {new Date().getFullYear()}</span>
            </div>
          </div>
        </footer>
      </main>
    </TooltipProvider>
  );
}
