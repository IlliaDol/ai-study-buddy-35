import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function QuickStudy() {
  const [selectedCategory, setSelectedCategory] = useState('general')
  const [currentCard, setCurrentCard] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [isStarted, setIsStarted] = useState(false)
  const navigate = useNavigate()

  const categories = [
    { id: 'general', name: 'Загальні знання', icon: '🧠', color: 'from-blue-500 to-cyan-500' },
    { id: 'science', name: 'Наука', icon: '🔬', color: 'from-purple-500 to-pink-500' },
    { id: 'history', name: 'Історія', icon: '📚', color: 'from-emerald-500 to-teal-500' },
    { id: 'geography', name: 'Географія', icon: '🌍', color: 'from-orange-500 to-red-500' },
    { id: 'literature', name: 'Література', icon: '📖', color: 'from-indigo-500 to-purple-500' },
    { id: 'math', name: 'Математика', icon: '📐', color: 'from-rose-500 to-pink-500' }
  ]

  // Приклад флешкарток для загальних знань
  const flashcardData = {
    general: [
      { question: 'Столиця України?', answer: 'Київ', difficulty: 'easy' },
      { question: 'Скільки планет в Сонячній системі?', answer: '8 планет', difficulty: 'medium' },
      { question: 'Хто написав "Ромео і Джульєтта"?', answer: 'Вільям Шекспір', difficulty: 'medium' },
      { question: 'Яка найбільша планета?', answer: 'Юпітер', difficulty: 'easy' },
      { question: 'Рік заснування Києва?', answer: '482 рік', difficulty: 'hard' }
    ],
    science: [
      { question: 'Хімічний символ золота?', answer: 'Au', difficulty: 'medium' },
      { question: 'Формула води?', answer: 'H₂O', difficulty: 'easy' },
      { question: 'Що таке ДНК?', answer: 'Дезоксирибонуклеїнова кислота', difficulty: 'hard' },
      { question: 'Швидкість світла?', answer: '300,000 км/с', difficulty: 'medium' },
      { question: 'Атомний номер вуглецю?', answer: '6', difficulty: 'medium' }
    ],
    history: [
      { question: 'Рік проголошення незалежності України?', answer: '1991', difficulty: 'easy' },
      { question: 'Хто був першим президентом України?', answer: 'Леонід Кравчук', difficulty: 'medium' },
      { question: 'Рік битви під Полтавою?', answer: '1709', difficulty: 'medium' },
      { question: 'Хто заснував Київ?', answer: 'Кий, Щек, Хорив і Либідь', difficulty: 'hard' },
      { question: 'Рік Хрещення Русі?', answer: '988', difficulty: 'medium' }
    ]
  }

  const currentCards = flashcardData[selectedCategory as keyof typeof flashcardData] || flashcardData.general
  const progress = isStarted ? ((currentCard + 1) / currentCards.length) * 100 : 0

  const startStudy = () => {
    setIsStarted(true)
    setCurrentCard(0)
    setScore(0)
    setShowAnswer(false)
  }

  const nextCard = () => {
    if (currentCard < currentCards.length - 1) {
      setCurrentCard(currentCard + 1)
      setShowAnswer(false)
    } else {
      // Завершено
      setIsStarted(false)
    }
  }

  const checkAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 1)
    }
    setShowAnswer(true)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'hard': return 'text-red-600 bg-red-100'
      default: return 'text-slate-600 bg-slate-100'
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Легко'
      case 'medium': return 'Середньо'
      case 'hard': return 'Складно'
      default: return 'Невідомо'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            <span className="bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
              Швидке Навчання
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Готові набори флешкарток для швидкого повторення матеріалу. Ідеально для перерв та коротких сесій навчання.
          </p>
        </div>

        {/* Category Selection */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Виберіть категорію</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 text-center hover:scale-105 ${
                  selectedCategory === category.id
                    ? 'border-purple-500 bg-purple-50 shadow-lg'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${category.color} flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-3xl">{category.icon}</span>
                </div>
                <div className="font-semibold text-slate-900">{category.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Study Interface */}
        {!isStarted ? (
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-8 text-center">
            <div className="text-6xl mb-6">⚡</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              {categories.find(c => c.id === selectedCategory)?.name}
            </h3>
            <p className="text-slate-600 mb-6">
              {currentCards.length} флешкарток для швидкого навчання
            </p>
            <button
              onClick={startStudy}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <span className="text-2xl mr-3">🚀</span>
              Почати навчання
            </button>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-8">
            {/* Progress Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-6 text-slate-600 mb-4">
                <span className="flex items-center gap-2">
                  <span className="text-lg">📚</span>
                  {currentCard + 1} з {currentCards.length}
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-lg">🎯</span>
                  {score} правильно
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full max-w-md mx-auto bg-slate-200 rounded-full h-3 mb-6">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Flashcard */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-3xl p-12 text-center mb-8">
                <div className="text-6xl mb-6">💭</div>
                <h4 className="text-3xl font-bold text-slate-900 mb-6">
                  {currentCards[currentCard].question}
                </h4>
                
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <span className={`px-3 py-1 rounded-full ${getDifficultyColor(currentCards[currentCard].difficulty)}`}>
                    {getDifficultyLabel(currentCards[currentCard].difficulty)}
                  </span>
                </div>
                
                {showAnswer ? (
                  <div className="space-y-4">
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <p className="text-xl text-slate-700">
                        <span className="font-semibold">Відповідь:</span> {currentCards[currentCard].answer}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-lg text-slate-600">
                    Натисніть "Показати відповідь" щоб побачити правильну відповідь
                  </p>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                {!showAnswer ? (
                  <button
                    onClick={() => setShowAnswer(true)}
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
                  >
                    Показати відповідь
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
                      onClick={nextCard}
                      className="px-6 py-3 bg-slate-500 text-white font-medium rounded-xl hover:bg-slate-600 transition-colors duration-300"
                    >
                      Далі →
                    </button>
                  </div>
                )}
              </div>
            </div>
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
