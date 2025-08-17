import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function CourseComplete() {
  const [course, setCourse] = useState<any>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const savedCourse = localStorage.getItem('currentCourse')
    if (savedCourse) {
      setCourse(JSON.parse(savedCourse))
      setShowConfetti(true)
      
      // Очистити курс з localStorage
      localStorage.removeItem('currentCourse')
    } else {
      navigate('/learning')
    }
  }, [navigate])

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [showConfetti])

  if (!course) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#10b981'][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
        {/* Success Icon */}
        <div className="w-32 h-32 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
          <span className="text-6xl">🎉</span>
        </div>

        {/* Congratulations */}
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
          Вітаємо! 🎊
        </h1>
        
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-8">
          Ви успішно завершили курс
          <br />
          <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
            "{course.title}"
          </span>
        </h2>

        {/* Course Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-6">
            <div className="text-3xl font-bold text-cyan-500 mb-2">
              {course.totalLessons}
            </div>
            <div className="text-slate-600">Уроків пройдено</div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-6">
            <div className="text-3xl font-bold text-purple-500 mb-2">
              {course.modules.length}
            </div>
            <div className="text-slate-600">Модулів завершено</div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-6">
            <div className="text-3xl font-bold text-emerald-500 mb-2">
              100%
            </div>
            <div className="text-slate-600">Прогрес</div>
          </div>
        </div>

        {/* Achievement Badge */}
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white p-8 rounded-3xl mb-12 shadow-2xl">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-2xl font-bold mb-2">Досягнення розблоковано!</h3>
          <p className="text-amber-100">
            "Першопрохідник" - за успішне завершення першого курсу
          </p>
        </div>

        {/* Next Steps */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Що далі?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center">
                  <span className="text-cyan-600 font-bold">1</span>
                </div>
                <span className="text-slate-700">Повторіть матеріал для закріплення</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold">2</span>
                </div>
                <span className="text-slate-700">Створіть новий курс на іншу тему</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 font-bold">3</span>
                </div>
                <span className="text-slate-700">Поділіться знаннями з друзями</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-bold">4</span>
                </div>
                <span className="text-slate-700">Відстежуйте свій прогрес</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/learning')}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105"
          >
            <span className="text-2xl mr-3">🚀</span>
            Створити новий курс
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-white/80 backdrop-blur-xl border border-slate-200 text-slate-700 font-semibold rounded-2xl hover:bg-white transition-all duration-300"
          >
            <span className="text-2xl mr-3">🏠</span>
            На головну
          </button>
        </div>

        {/* Social Share */}
        <div className="mt-12">
          <p className="text-slate-600 mb-4">Поділіться своїм досягненням:</p>
          <div className="flex items-center justify-center gap-4">
            <button className="w-12 h-12 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-300">
              <span className="text-lg">📘</span>
            </button>
            <button className="w-12 h-12 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-300">
              <span className="text-lg">📱</span>
            </button>
            <button className="w-12 h-12 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors duration-300">
              <span className="text-lg">💬</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
