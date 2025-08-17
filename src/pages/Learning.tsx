import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Learning() {
  const [topic, setTopic] = useState('')
  const [level, setLevel] = useState('beginner')
  const [language, setLanguage] = useState('uk')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCourse, setGeneratedCourse] = useState<any>(null)
  const navigate = useNavigate()

  const levels = [
    { value: 'beginner', label: 'Початківець', icon: '🌱' },
    { value: 'intermediate', label: 'Середній', icon: '🌿' },
    { value: 'advanced', label: 'Просунутий', icon: '🌳' }
  ]

  const languages = [
    { value: 'uk', label: 'Українська', flag: '🇺🇦' },
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'de', label: 'Deutsch', flag: '🇩🇪' }
  ]

  const handleGenerateCourse = async () => {
    if (!topic.trim()) return
    
    setIsGenerating(true)
    
    // Симуляція генерації курсу
    setTimeout(() => {
      const course = {
        title: topic,
        level: level,
        language: language,
        modules: [
          {
            id: 1,
            title: 'Вступ до теми',
            lessons: [
              { id: 1, title: 'Основні поняття', duration: '15 хв', type: 'video' },
              { id: 2, title: 'Історія розвитку', duration: '20 хв', type: 'reading' },
              { id: 3, title: 'Перший тест', duration: '10 хв', type: 'quiz' }
            ]
          },
          {
            id: 2,
            title: 'Практичні аспекти',
            lessons: [
              { id: 4, title: 'Практичні приклади', duration: '25 хв', type: 'practice' },
              { id: 5, title: 'Вирішення задач', duration: '30 хв', type: 'exercise' },
              { id: 6, title: 'Фінальний тест', duration: '15 хв', type: 'quiz' }
            ]
          }
        ],
        totalLessons: 6,
        estimatedTime: '2 години',
        difficulty: level
      }
      
      setGeneratedCourse(course)
      setIsGenerating(false)
    }, 3000)
  }

  const startLearning = (course: any) => {
    // Тут можна зберегти курс в localStorage або Redux
    localStorage.setItem('currentCourse', JSON.stringify(course))
    navigate('/course-player')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
              AI Генератор Курсів
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Опишіть тему, яку хочете вивчити, і наш AI створить персоналізований курс навчання
          </p>
        </div>

        {/* Course Generator Form */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Topic Input */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Що хочете вивчити?
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Наприклад: JavaScript для початківців, Історія України, Математика..."
                className="w-full px-6 py-4 text-lg bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-300 transition-all duration-300"
              />
            </div>

            {/* Level Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Ваш рівень
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-6 py-4 text-lg bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-300 transition-all duration-300"
              >
                {levels.map((lvl) => (
                  <option key={lvl.value} value={lvl.value}>
                    {lvl.icon} {lvl.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Language Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Мова навчання
            </label>
            <div className="flex gap-4">
              {languages.map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => setLanguage(lang.value)}
                  className={`px-6 py-3 rounded-xl border-2 transition-all duration-300 ${
                    language === lang.value
                      ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <span className="text-lg mr-2">{lang.flag}</span>
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="text-center">
            <button
              onClick={handleGenerateCourse}
              disabled={!topic.trim() || isGenerating}
              className={`px-12 py-5 text-xl font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                !topic.trim() || isGenerating
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-2xl hover:shadow-cyan-500/25'
              }`}
            >
              {isGenerating ? (
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  AI генерує курс...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🚀</span>
                  Створити курс
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Generated Course */}
        {generatedCourse && (
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Курс: {generatedCourse.title}
              </h2>
              <div className="flex items-center justify-center gap-6 text-slate-600">
                <span className="flex items-center gap-2">
                  <span className="text-lg">📚</span>
                  {generatedCourse.totalLessons} уроків
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-lg">⏱️</span>
                  {generatedCourse.estimatedTime}
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-lg">🎯</span>
                  {levels.find(l => l.value === generatedCourse.difficulty)?.label}
                </span>
              </div>
            </div>

            {/* Course Modules */}
            <div className="space-y-6 mb-8">
              {generatedCourse.modules.map((module: any) => (
                <div key={module.id} className="bg-slate-50/50 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">
                    {module.title}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {module.lessons.map((lesson: any) => (
                      <div key={lesson.id} className="bg-white rounded-xl p-4 border border-slate-200">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">
                            {lesson.type === 'video' ? '🎥' : 
                             lesson.type === 'reading' ? '📖' : 
                             lesson.type === 'quiz' ? '🧠' : '✏️'}
                          </span>
                          <span className="text-sm text-slate-500">{lesson.duration}</span>
                        </div>
                        <h4 className="font-medium text-slate-900">{lesson.title}</h4>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Start Learning Button */}
            <div className="text-center">
              <button
                onClick={() => startLearning(generatedCourse)}
                className="px-12 py-5 text-xl font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <span className="text-2xl mr-3">🎯</span>
                Почати навчання
              </button>
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
