import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Features() {
  const [activeFeature, setActiveFeature] = useState(0)
  const navigate = useNavigate()

  const features = [
    {
      icon: "🧠",
      title: "AI Генератор Курсів",
      description: "Створюйте персоналізовані курси за допомогою штучного інтелекту. Просто опишіть тему, і AI створить структурований план навчання.",
      color: "from-cyan-500 to-blue-600",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20"
    },
    {
      icon: "🎯",
      title: "Адаптивне Навчання",
      description: "Система автоматично адаптується до вашого рівня знань та темпу навчання. Отримуйте завдання, які відповідають вашим можливостям.",
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20"
    },
    {
      icon: "🌍",
      title: "Мовна Лабораторія",
      description: "Вивчайте іноземні мови з AI-помічником. Створюйте флешкартки, проходьте тести та практикуйте розмовну мову.",
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20"
    },
    {
      icon: "🎮",
      title: "Гейміфікація",
      description: "Заробляйте XP, проходьте рівні та змагайтеся з друзями. Навчання стає захоплюючою грою!",
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20"
    },
    {
      icon: "📊",
      title: "Детальна Аналітика",
      description: "Відстежуйте свій прогрес, аналізуйте слабкі місця та отримуйте рекомендації для покращення результатів.",
      color: "from-indigo-500 to-purple-600",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/20"
    },
    {
      icon: "🚀",
      title: "Швидкий Старт",
      description: "Починайте навчання за 30 секунд. Без складної реєстрації, без налаштувань - просто опишіть, що хочете вивчити.",
      color: "from-rose-500 to-pink-600",
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-500/20"
    }
  ]

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-blue-50"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Чому <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">AI Study Buddy</span>?
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Наша платформа поєднує найкращі практики навчання з революційними технологіями штучного інтелекту
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative p-8 rounded-3xl border-2 transition-all duration-500 hover:scale-105 cursor-pointer ${
                activeFeature === index 
                  ? 'shadow-2xl shadow-slate-200/50 border-slate-300' 
                  : 'shadow-lg shadow-slate-100/50 border-slate-200 hover:shadow-xl hover:shadow-slate-200/50'
              } ${feature.bgColor} ${feature.borderColor}`}
              onClick={() => setActiveFeature(index)}
            >
              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-slate-700 transition-colors duration-300">
                {feature.title}
              </h3>
              
              <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
                {feature.description}
              </p>

              {/* Hover Effect */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

              {/* Active Indicator */}
              {activeFeature === index && (
                <div className={`absolute top-4 right-4 w-3 h-3 bg-gradient-to-r ${feature.color} rounded-full animate-pulse`}></div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white px-8 py-4 rounded-2xl shadow-2xl">
            <span className="text-2xl">🎯</span>
            <span className="font-semibold">Готові почати навчання?</span>
            <button 
              onClick={() => navigate('/learning')}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2 rounded-xl font-medium hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              Спробувати зараз
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
