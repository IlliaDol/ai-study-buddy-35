import { Card } from "@/components/ui/card";
import { BookOpen, Globe, Brain, Sparkles, Flame, GraduationCap, KeyRound, Settings as SettingsIcon } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";
import { useGamification } from "@/hooks/useGamification";
import { Settings } from "./Settings";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

interface MainNavigationProps {
  onTopicLearning: () => void;
  onLanguageLearning: () => void;
  onCourseGeneration: () => void;
}

export const MainNavigation = ({ onTopicLearning, onLanguageLearning, onCourseGeneration }: MainNavigationProps) => {
  const { t, i18n } = useTranslation();
  const { xp, streak } = useGamification();
  const [showSettings, setShowSettings] = useState(false);
  const provider = (typeof window !== 'undefined' && (localStorage.getItem('AI_PROVIDER') || (localStorage.getItem('OPENAI_API_KEY') ? 'openai' : ''))) || '';
  const aiKey = typeof window !== 'undefined' ? (localStorage.getItem('AI_API_KEY') || localStorage.getItem('OPENAI_API_KEY') || '') : '';
  const hasAIKey = !!aiKey;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + i * 0.1,
        duration: 0.5
      }
    })
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section - Modern Glassmorphism style */}
      <div
        className="relative bg-cover bg-center py-16 md:py-24 overflow-hidden hero-background"
      >
        {/* Background overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-violet-600/30 backdrop-blur-md" />

        {/* Dark scrim overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />

        {/* Animated floating shapes */}
        {mounted && (
          <>
            <motion.div
              className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-500/20 backdrop-blur-xl"
              animate={{
                x: [0, 30, 0],
                y: [0, -30, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/3 w-48 h-48 rounded-full bg-violet-500/20 backdrop-blur-xl"
              animate={{
                x: [0, -20, 0],
                y: [0, 20, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </>
        )}

        <div className="relative container mx-auto px-4 text-center">
          {/* Header Content */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              {t('app.title')}
            </h1>

            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white/90">
              Master any topic or language with structured flashcards and quizzes.
              <span className="text-emerald-300 font-semibold"> Powered by AI</span> when connected.
            </p>
          </motion.div>

          {/* Control Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-10"
          >
            {/* Settings button */}
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="inline-flex items-center gap-2 text-sm bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2 hover:bg-white dark:hover:bg-slate-700 hover:shadow-md transition-all"
              aria-label={t('nav.settings')}
            >
              <SettingsIcon size={16} />
              {t('nav.settings')}
            </button>

            {/* Provider badge */}
            {hasAIKey ? (
              <span className="text-sm bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 rounded-full px-3 py-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                {provider || 'deepseek'}
              </span>
            ) : (
              <span className="text-sm bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50 rounded-full px-3 py-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                {t('main.status.noKey')}
              </span>
            )}

            {/* Language selector - Redesigned */}
            <div className="flex items-center gap-1 bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-full overflow-hidden shadow-sm">
              {['en', 'uk', 'de'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => changeLanguage(lang)}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                    i18n.language === lang
                      ? 'bg-primary text-white'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Stats panel - Redesigned */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-flex items-center gap-5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-full px-6 py-3 shadow-lg"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                <Flame size={18} className="text-amber-500" />
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{t('main.stats.streak')}</div>
                <div className="font-bold">{t('main.stats.days', { count: streak })}</div>
              </div>
            </div>

            <div className="w-px h-10 bg-slate-200 dark:bg-slate-700"></div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center">
                <Sparkles size={18} className="text-violet-500" />
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{t('main.stats.xp')}</div>
                <div className="font-bold">{xp} XP</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Cards Grid - Redesigned with animations */}
      <div className="max-w-7xl mx-auto px-6 py-16 -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Topic Learning */}
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <Card
              className="group overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer bg-white dark:bg-slate-800 border-0 h-full relative"
              onClick={onTopicLearning}
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 relative z-10"></div>
              <div className="p-8 flex flex-col items-center text-center h-full relative z-10">
                <div className="h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300">
                  <Brain size={36} className="text-blue-600 dark:text-blue-400 group-hover:animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {t('main.topicCard.title')}
                </h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6">{t('main.topicCard.description')}</p>
                <div className="mt-auto">
                  <div className="inline-flex items-center justify-center px-5 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm group-hover:bg-blue-100 dark:group-hover:bg-blue-800/50 transition-colors">
                    <Brain size={14} className="mr-2 group-hover:animate-bounce" /> {t('main.actions.startLearning')}
                  </div>
                </div>
              </div>
              
              {/* Floating particles effect */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400/30 rounded-full animate-ping"></div>
                <div className="absolute bottom-8 left-6 w-1 h-1 bg-blue-300/40 rounded-full animate-pulse delay-1000"></div>
              </div>
            </Card>
          </motion.div>

          {/* Course Generator */}
          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <Card
              className="group overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer bg-white dark:bg-slate-800 border-0 h-full relative"
              onClick={onCourseGeneration}
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="p-2 bg-violet-50 dark:bg-violet-900/20 relative z-10"></div>
              <div className="p-8 flex flex-col items-center text-center h-full relative z-10">
                <div className="h-20 w-20 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap size={36} className="text-violet-600 dark:text-violet-400 group-hover:animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-slate-800 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  {t('main.courseCard.title')}
                </h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6">{t('main.courseCard.description')}</p>
                <div className="mt-auto">
                  <div className="inline-flex items-center justify-center px-5 py-2 bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full text-sm group-hover:bg-violet-100 dark:group-hover:bg-violet-800/50 transition-colors">
                    <GraduationCap size={14} className="mr-2 group-hover:animate-bounce" /> Create Course
                  </div>
                </div>
              </div>
              
              {/* Floating particles effect */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-4 right-4 w-2 h-2 bg-violet-400/30 rounded-full animate-ping"></div>
                <div className="absolute bottom-8 left-6 w-1 h-1 bg-violet-300/40 rounded-full animate-pulse delay-1000"></div>
              </div>
            </Card>
          </motion.div>

          {/* Language Learning */}
          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <Card
              className="group overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer bg-white dark:bg-slate-800 border-0 h-full relative"
              onClick={onLanguageLearning}
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="p-2 bg-teal-50 dark:bg-teal-900/20 relative z-10"></div>
              <div className="p-8 flex flex-col items-center text-center h-full relative z-10">
                <div className="h-20 w-20 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300">
                  <Globe size={36} className="text-teal-600 dark:text-teal-400 group-hover:animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-slate-800 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {t('main.languageCard.title')}
                </h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6">{t('main.languageCard.description')}</p>
                <div className="mt-auto">
                  <div className="inline-flex items-center justify-center px-5 py-2 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-sm group-hover:bg-teal-100 dark:group-hover:bg-teal-800/50 transition-colors">
                    <Globe size={14} className="mr-2 group-hover:animate-bounce" /> Learn Languages
                  </div>
                </div>
              </div>
              
              {/* Floating particles effect */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-4 right-4 w-2 h-2 bg-teal-400/30 rounded-full animate-ping"></div>
                <div className="absolute bottom-8 left-6 w-1 h-1 bg-teal-300/40 rounded-full animate-pulse delay-1000"></div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <Settings onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
};