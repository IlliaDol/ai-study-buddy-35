import { Card } from "@/components/ui/card";
import { BookOpen, Globe, Brain, Sparkles, Flame, GraduationCap, KeyRound, Settings as SettingsIcon, Zap, Target, TrendingUp } from "lucide-react";
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
  onQuickStudy: () => void;
}

export const MainNavigation = ({ onTopicLearning, onLanguageLearning, onCourseGeneration, onQuickStudy }: MainNavigationProps) => {
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
      {/* Hero Section - Enhanced Glassmorphism style */}
      <div
        className="relative bg-cover bg-center py-20 md:py-32 overflow-hidden hero-background"
      >
        {/* Enhanced background overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-violet-600/30 to-purple-600/40 backdrop-blur-xl" />

        {/* Enhanced dark scrim overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />

        {/* Enhanced animated floating shapes */}
        {mounted && (
          <>
            <motion.div
              className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-blue-500/20 backdrop-blur-2xl"
              animate={{
                x: [0, 40, 0],
                y: [0, -40, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full bg-violet-500/20 backdrop-blur-2xl"
              animate={{
                x: [0, -30, 0],
                y: [0, 30, 0],
                rotate: [0, -180, -360],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-emerald-500/15 backdrop-blur-2xl"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 180],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </>
        )}

        <div className="relative container mx-auto px-4 text-center">
          {/* Enhanced Header Content */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-8"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-4 mb-6"
            >
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 via-violet-600 to-purple-600 flex items-center justify-center shadow-2xl">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-6xl md:text-8xl font-bold mb-2 text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                  {t('app.title')}
                </h1>
                <p className="text-lg text-white/80 font-medium">Your AI Learning Companion</p>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-2xl md:text-3xl mb-10 max-w-4xl mx-auto text-white/90 leading-relaxed"
            >
              Master any topic or language with structured flashcards and quizzes.
              <span className="text-emerald-300 font-semibold"> Powered by AI</span> when connected.
            </motion.p>
          </motion.div>

          {/* Enhanced Control Panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-12"
          >
            {/* Enhanced Settings button */}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setShowSettings(true)}
              className="inline-flex items-center gap-3 text-sm bg-white/95 dark:bg-slate-800/95 text-slate-800 dark:text-white border border-white/30 dark:border-slate-700/50 rounded-2xl px-6 py-3 hover:bg-white dark:hover:bg-slate-700 hover:shadow-xl transition-all duration-300 backdrop-blur-xl"
              aria-label={t('nav.settings')}
            >
              <SettingsIcon size={18} />
              {t('nav.settings')}
            </motion.button>

            {/* Enhanced Provider badge */}
            {hasAIKey ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-sm bg-emerald-50/90 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50 rounded-2xl px-4 py-3 backdrop-blur-xl shadow-lg"
              >
                <span className="inline-block w-3 h-3 rounded-full bg-emerald-500 mr-2 animate-pulse shadow-lg"></span>
                {provider || 'deepseek'}
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-sm bg-amber-50/90 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/50 rounded-2xl px-4 py-3 backdrop-blur-xl shadow-lg"
              >
                <span className="inline-block w-3 h-3 rounded-full bg-amber-500 mr-2 shadow-lg"></span>
                {t('main.status.noKey')}
              </motion.div>
            )}

            {/* Enhanced Language selector */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-1 bg-white/90 dark:bg-slate-800/90 border border-white/30 dark:border-slate-700/50 rounded-2xl overflow-hidden shadow-lg backdrop-blur-xl"
            >
              {['en', 'uk', 'de'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => changeLanguage(lang)}
                  className={`px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                    i18n.language === lang
                      ? 'bg-gradient-to-r from-blue-500 to-violet-600 text-white shadow-lg'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </motion.div>
          </motion.div>

          {/* Enhanced Stats panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="inline-flex items-center gap-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl border border-white/30 dark:border-slate-700/50 rounded-3xl px-8 py-4 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                <Flame size={20} className="text-white" />
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('main.stats.streak')}</div>
                <div className="text-xl font-bold text-slate-800 dark:text-white">{t('main.stats.days', { count: streak })}</div>
              </div>
            </div>

            <div className="w-px h-12 bg-slate-200 dark:bg-slate-700"></div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-lg">
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('main.stats.xp')}</div>
                <div className="text-xl font-bold text-slate-800 dark:text-white">{xp} XP</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Cards Grid */}
      <div className="max-w-7xl mx-auto px-6 py-20 -mt-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8">
          {/* Enhanced Topic Learning */}
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                className="group overflow-hidden shadow-2xl hover:shadow-3xl transform transition-all duration-500 cursor-pointer bg-white/95 dark:bg-slate-800/95 border-0 h-full relative backdrop-blur-xl border border-white/20 dark:border-slate-700/50"
                onClick={onTopicLearning}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-6 shadow-xl group-hover:shadow-2xl transition-shadow duration-300">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">{t('main.topicCard.title')}</h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">{t('main.topicCard.description')}</p>
                  <div className="mt-auto">
                    <div className="inline-flex items-center justify-center px-6 py-3 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-2xl text-sm font-semibold group-hover:bg-blue-100 dark:group-hover:bg-blue-800/50 transition-all duration-300 shadow-lg">
                      <Brain size={16} className="mr-2 group-hover:animate-bounce" /> {t('main.actions.startLearning')}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>

          {/* Enhanced Language Learning */}
          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                className="group overflow-hidden shadow-2xl hover:shadow-3xl transform transition-all duration-500 cursor-pointer bg-white/95 dark:bg-slate-800/95 border-0 h-full relative backdrop-blur-xl border border-white/20 dark:border-slate-700/50"
                onClick={onLanguageLearning}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-6 shadow-xl group-hover:shadow-2xl transition-shadow duration-300">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">{t('main.languageCard.title')}</h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">{t('main.languageCard.description')}</p>
                  <div className="mt-auto">
                    <div className="inline-flex items-center justify-center px-6 py-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-2xl text-sm font-semibold group-hover:bg-emerald-100 dark:group-hover:bg-emerald-800/50 transition-all duration-300 shadow-lg">
                      <Globe size={16} className="mr-2 group-hover:animate-bounce" /> {t('main.actions.startLearning')}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>

          {/* Enhanced Course Generation */}
          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                className="group overflow-hidden shadow-2xl hover:shadow-3xl transform transition-all duration-500 cursor-pointer bg-white/95 dark:bg-slate-800/95 border-0 h-full relative backdrop-blur-xl border border-white/20 dark:border-slate-700/50"
                onClick={onCourseGeneration}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center mb-6 shadow-xl group-hover:shadow-2xl transition-shadow duration-300">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">{t('main.courseCard.title')}</h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">{t('main.courseCard.description')}</p>
                  <div className="mt-auto">
                    <div className="inline-flex items-center justify-center px-6 py-3 bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-2xl text-sm font-semibold group-hover:bg-violet-100 dark:group-hover:bg-violet-800/50 transition-all duration-300 shadow-lg">
                      <GraduationCap size={16} className="mr-2 group-hover:animate-bounce" /> {t('main.actions.startLearning')}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>

          {/* Enhanced Quick Study */}
          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                className="group overflow-hidden shadow-2xl hover:shadow-3xl transform transition-all duration-500 cursor-pointer bg-white/95 dark:bg-slate-800/95 border-0 h-full relative backdrop-blur-xl border border-white/20 dark:border-slate-700/50"
                onClick={onQuickStudy}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-6 shadow-xl group-hover:shadow-2xl transition-shadow duration-300">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">{t('main.quickStudyCard.title')}</h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">{t('main.quickStudyCard.description')}</p>
                  <div className="mt-auto">
                    <div className="inline-flex items-center justify-center px-6 py-3 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-2xl text-sm font-semibold group-hover:bg-amber-100 dark:group-hover:bg-amber-800/50 transition-all duration-300 shadow-lg">
                      <Zap size={16} className="mr-2 group-hover:animate-bounce" /> {t('main.actions.startLearning')}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
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