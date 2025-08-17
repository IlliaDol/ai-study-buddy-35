import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function CoursePlayer() {
  const [currentCourse, setCurrentCourse] = useState<any>(null)
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0)
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isLessonComplete, setIsLessonComplete] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const savedCourse = localStorage.getItem('currentCourse')
    if (savedCourse) {
      setCurrentCourse(JSON.parse(savedCourse))
    } else {
      navigate('/learning')
    }
  }, [navigate])

  useEffect(() => {
    if (currentCourse) {
      const totalLessons = currentCourse.modules.reduce((acc: number, module: any) => acc + module.lessons.length, 0)
      const completedLessons = currentModuleIndex * currentCourse.modules[0].lessons.length + currentLessonIndex
      setProgress((completedLessons / totalLessons) * 100)
    }
  }, [currentModuleIndex, currentLessonIndex, currentCourse])

  if (!currentCourse) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Завантаження курсу...</p>
        </div>
      </div>
    )
  }

  const currentModule = currentCourse.modules[currentModuleIndex]
  const currentLesson = currentModule.lessons[currentLessonIndex]
  const totalModules = currentCourse.modules.length
  const totalLessons = currentModule.lessons.length

  const nextLesson = () => {
    if (currentLessonIndex < totalLessons - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1)
      setIsLessonComplete(false)
    } else if (currentModuleIndex < totalModules - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1)
      setCurrentLessonIndex(0)
      setIsLessonComplete(false)
    } else {
      // Курс завершено
      navigate('/course-complete')
    }
  }

  const previousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1)
      setIsLessonComplete(false)
    } else if (currentModuleIndex > 0) {
      setCurrentModuleIndex(currentModuleIndex - 1)
      setCurrentLessonIndex(currentCourse.modules[currentModuleIndex - 1].lessons.length - 1)
      setIsLessonComplete(false)
    }
  }

  const completeLesson = () => {
    setIsLessonComplete(true)
  }

  const getLessonContent = (lesson: any) => {
    switch (lesson.type) {
      case 'video':
        return (
          <div className="text-center">
            <div className="w-full max-w-2xl mx-auto bg-slate-100 rounded-2xl p-12 mb-6">
              <span className="text-6xl">🎥</span>
              <p className="text-slate-600 mt-4">Відео урок: {lesson.title}</p>
            </div>
            <p className="text-slate-600">Тривалість: {lesson.duration}</p>
          </div>
        )
      
      case 'reading':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg mx-auto">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">{lesson.title}</h3>
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <p className="text-slate-700 leading-relaxed mb-4">
                  Це текстовий урок з детальним поясненням теми. Тут буде розміщено навчальний матеріал, 
                  який AI згенерував спеціально для вас.
                </p>
                <p className="text-slate-700 leading-relaxed mb-4">
                  Ви можете читати в власному темпі та повертатися до складних моментів. 
                  Після прочитання натисніть "Завершити урок" щоб продовжити.
                </p>
                <div className="bg-cyan-50 border-l-4 border-cyan-500 p-4 rounded-r-lg">
                  <p className="text-cyan-800 font-medium">
                    💡 Порада: Делайте нотатки під час читання для кращого засвоєння матеріалу.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'quiz':
        return (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Тест: {lesson.title}</h3>
              <div className="space-y-4">
                <div className="p-4 border border-slate-200 rounded-xl">
                  <p className="font-medium text-slate-900 mb-3">Питання 1: Що таке AI Study Buddy?</p>
                  <div className="space-y-2">
                    {['Платформа для навчання', 'Іграшка', 'Соціальна мережа'].map((option, index) => (
                      <label key={index} className="flex items-center gap-3 cursor-pointer">
                        <input type="radio" name="q1" value={option} className="text-cyan-500" />
                        <span className="text-slate-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 border border-slate-200 rounded-xl">
                  <p className="font-medium text-slate-900 mb-3">Питання 2: Як AI створює курси?</p>
                  <div className="space-y-2">
                    {['Аналізує тему та генерує план', 'Копіює з інтернету', 'Вигадує з голови'].map((option, index) => (
                      <label key={index} className="flex items-center gap-3 cursor-pointer">
                        <input type="radio" name="q2" value={option} className="text-cyan-500" />
                        <span className="text-slate-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'practice':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Практичне завдання: {lesson.title}</h3>
              <div className="space-y-6">
                <p className="text-slate-700 leading-relaxed">
                  Це практичне завдання для закріплення матеріалу. Виконайте наступні кроки:
                </p>
                
                <div className="bg-slate-50 rounded-xl p-6">
                  <h4 className="font-semibold text-slate-900 mb-3">Завдання:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-slate-700">
                    <li>Проаналізуйте наданий матеріал</li>
                    <li>Спробуйте застосувати знання на практиці</li>
                    <li>Перевірте свої результати</li>
                    <li>Зробіть висновки та запишіть їх</li>
                  </ol>
                </div>
                
                <div className="bg-cyan-50 border-l-4 border-cyan-500 p-4 rounded-r-lg">
                  <p className="text-cyan-800">
                    💪 Практика - найкращий спосіб засвоєння нових знань!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      
      default:
        return (
          <div className="text-center">
            <div className="w-full max-w-2xl mx-auto bg-slate-100 rounded-2xl p-12">
              <span className="text-6xl">📝</span>
              <p className="text-slate-600 mt-4">Урок: {lesson.title}</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header with Progress */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-white/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/learning')}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
              >
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-bold text-slate-900">{currentCourse.title}</h1>
                <p className="text-sm text-slate-600">
                  Модуль {currentModuleIndex + 1} з {totalModules} • Урок {currentLessonIndex + 1} з {totalLessons}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm font-medium text-slate-700 mb-1">
                Прогрес: {Math.round(progress)}%
              </div>
              <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Lesson Content */}
        <div className="mb-12">
          {getLessonContent(currentLesson)}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={previousLesson}
            disabled={currentModuleIndex === 0 && currentLessonIndex === 0}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              currentModuleIndex === 0 && currentLessonIndex === 0
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            ← Попередній урок
          </button>

          <div className="flex items-center gap-4">
            {!isLessonComplete ? (
              <button
                onClick={completeLesson}
                className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-700 transition-all duration-300"
              >
                Завершити урок
              </button>
            ) : (
              <button
                onClick={nextLesson}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-medium hover:from-cyan-600 hover:to-blue-700 transition-all duration-300"
              >
                {currentModuleIndex === totalModules - 1 && currentLessonIndex === totalLessons - 1
                  ? 'Завершити курс'
                  : 'Наступний урок →'
                }
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
