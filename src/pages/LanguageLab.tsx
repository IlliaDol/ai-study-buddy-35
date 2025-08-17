import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LanguageLab() {
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [learningMode, setLearningMode] = useState('vocabulary')
  const [currentWord, setCurrentWord] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const navigate = useNavigate()

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸', native: 'Англійська' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪', native: 'Німецька' },
    { code: 'fr', name: 'Français', flag: '🇫🇷', native: 'Французька' },
    { code: 'es', name: 'Español', flag: '🇪🇸', native: 'Іспанська' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹', native: 'Італійська' }
  ]

  const learningModes = [
    { id: 'vocabulary', name: 'Словник', icon: '📚', description: 'Вивчайте нові слова та фрази' },
    { id: 'grammar', name: 'Граматика', icon: '📝', description: 'Практикуйте граматичні правила' },
    { id: 'conversation', name: 'Розмова', icon: '💬', description: 'Діалоги та повсякденні фрази' },
    { id: 'pronunciation', name: 'Вимова', icon: '🗣️', description: 'Практикуйте правильну вимову' }
  ]

  // Приклад слів для англійської мови
  const vocabularyData = {
    en: [
      { word: 'Hello', translation: 'Привіт', example: 'Hello, how are you?' },
      { word: 'Goodbye', translation: 'До побачення', example: 'Goodbye, see you later!' },
      { word: 'Thank you', translation: 'Дякую', example: 'Thank you for your help.' },
      { word: 'Please', translation: 'Будь ласка', example: 'Please, can you help me?' },
      { word: 'Sorry', translation: 'Вибачте', example: 'Sorry, I am late.' }
    ]
  }

  const currentLanguageData = languages.find(lang => lang.code === selectedLanguage)
  const currentWords = vocabularyData[selectedLanguage as keyof typeof vocabularyData] || vocabularyData.en

  const startLearning = () => {
    setCurrentWord(0)
    setScore(0)
    setTotalQuestions(currentWords.length)
    setShowAnswer(false)
  }

  const nextWord = () => {
    if (currentWord < currentWords.length - 1) {
      setCurrentWord(currentWord + 1)
      setShowAnswer(false)
    } else {
      // Завершено
      setCurrentWord(0)
      setShowAnswer(false)
    }
  }

  const checkAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 1)
    }
    setShowAnswer(true)
  }

  const progress = (currentWord / currentWords.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
              Мовна Лабораторія
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Вивчайте іноземні мови з AI-помічником. Створюйте флешкартки, проходьте тести та практикуйте розмовну мову.
          </p>
        </div>

        {/* Language Selection */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Виберіть мову для навчання</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => setSelectedLanguage(language.code)}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 text-center hover:scale-105 ${
                  selectedLanguage === language.code
                    ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-4xl mb-3">{language.flag}</div>
                <div className="font-semibold text-slate-900">{language.name}</div>
                <div className="text-sm text-slate-600">{language.native}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Learning Mode Selection */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Режим навчання</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {learningModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setLearningMode(mode.id)}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 text-center hover:scale-105 ${
                  learningMode === mode.id
                    ? 'border-teal-500 bg-teal-50 shadow-lg'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-4xl mb-3">{mode.icon}</div>
                <div className="font-semibold text-slate-900 mb-2">{mode.name}</div>
                <div className="text-sm text-slate-600">{mode.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Learning Interface */}
        {learningMode === 'vocabulary' && (
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Вивчення словника: {currentLanguageData?.name}
              </h3>
              <div className="flex items-center justify-center gap-6 text-slate-600 mb-6">
                <span className="flex items-center gap-2">
                  <span className="text-lg">📚</span>
                  {currentWords.length} слів
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-lg">🎯</span>
                  {score} з {totalQuestions} правильно
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full max-w-md mx-auto bg-slate-200 rounded-full h-3 mb-6">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              {totalQuestions === 0 && (
                <button
                  onClick={startLearning}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  <span className="text-2xl mr-3">🚀</span>
                  Почати навчання
                </button>
              )}
            </div>

            {/* Word Display */}
            {totalQuestions > 0 && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-3xl p-12 text-center mb-8">
                  <div className="text-6xl mb-6">📖</div>
                  <h4 className="text-3xl font-bold text-slate-900 mb-4">
                    {currentWords[currentWord].word}
                  </h4>
                  
                  {showAnswer ? (
                    <div className="space-y-4">
                      <p className="text-xl text-slate-700">
                        <span className="font-semibold">Переклад:</span> {currentWords[currentWord].translation}
                      </p>
                      <p className="text-lg text-slate-600">
                        <span className="font-semibold">Приклад:</span> {currentWords[currentWord].example}
                      </p>
                    </div>
                  ) : (
                    <p className="text-lg text-slate-600">
                      Натисніть "Показати переклад" щоб побачити відповідь
                    </p>
                  )}
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  {!showAnswer ? (
                    <button
                      onClick={() => setShowAnswer(true)}
                      className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105"
                    >
                      Показати переклад
                    </button>
                  ) : (
                    <div className="flex gap-4">
                      <button
                        onClick={() => checkAnswer(true)}
                        className="px-6 py-3 bg-emerald-500 text-white font-medium rounded-xl hover:bg-emerald-600 transition-colors duration-300"
                      >
                        Знаю ✅
                      </button>
                      <button
                        onClick={() => checkAnswer(false)}
                        className="px-6 py-3 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-colors duration-300"
                      >
                        Не знаю ❌
                      </button>
                      <button
                        onClick={nextWord}
                        className="px-6 py-3 bg-slate-500 text-white font-medium rounded-xl hover:bg-slate-600 transition-colors duration-300"
                      >
                        Далі →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Other Learning Modes Placeholder */}
        {learningMode !== 'vocabulary' && (
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-8 text-center">
            <div className="text-6xl mb-6">🚧</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              {learningModes.find(m => m.id === learningMode)?.name} - в розробці
            </h3>
            <p className="text-slate-600 mb-6">
              Цей режим навчання буде доступний найближчим часом!
            </p>
            <button
              onClick={() => setLearningMode('vocabulary')}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300"
            >
              Спробувати словник
            </button>
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 text-lg font-medium text-slate-600 bg-white/60 backdrop-blur-xl border border-slate-200 rounded-2xl hover:bg-white/80 transition-all duration-300"
          >
            ← Повернутися на головну
          </button>
        </div>
      </div>
    </div>
  )
}
