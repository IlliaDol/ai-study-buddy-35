import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const steps = [
    {
      number: "01",
      title: "Опишіть тему",
      description: "Просто напишіть, що хочете вивчити. Наприклад: 'JavaScript для початківців' або 'Історія України'",
      icon: "✍️",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20"
    },
    {
      number: "02",
      title: "AI аналізує",
      description: "Наш штучний інтелект аналізує вашу тему та створює структурований план навчання",
      icon: "🤖",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20"
    },
    {
      number: "03",
      title: "Отримуйте контент",
      description: "AI генерує флешкартки, тести, пояснення та практичні завдання для вашої теми",
      icon: "📚",
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20"
    },
    {
      number: "04",
      title: "Навчайтесь та прогресуйте",
      description: "Проходьте матеріал, відстежуйте прогрес та отримуйте персоналізовані рекомендації",
      icon: "🚀",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20"
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,119,198,0.2),transparent_50%)]"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-2xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Як це <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">працює</span>?
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Простий процес з 4 кроків, який перетворить будь-яку тему на структурований курс навчання
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`relative group transition-all duration-700 ${
                activeStep === index ? 'scale-105' : 'scale-100'
              }`}
            >
              {/* Step Card */}
              <div className={`relative p-8 rounded-3xl border-2 transition-all duration-500 h-full ${
                activeStep === index 
                  ? 'shadow-2xl shadow-white/10 border-white/30 bg-white/10' 
                  : 'shadow-lg shadow-black/20 border-white/20 bg-white/5 hover:bg-white/10'
              } ${step.bgColor} ${step.borderColor}`}>
                
                {/* Step Number */}
                <div className={`absolute -top-4 -left-4 w-12 h-12 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                  {step.number}
                </div>

                {/* Icon */}
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center text-4xl mb-6 mt-4 group-hover:scale-110 transition-transform duration-300`}>
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-200 transition-colors duration-300">
                  {step.title}
                </h3>
                
                <p className="text-white/80 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                  {step.description}
                </p>

                {/* Active Indicator */}
                {activeStep === index && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
                )}

                {/* Hover Effect */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${step.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              </div>

              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-white/30 to-transparent transform -translate-y-1/2"></div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="inline-flex items-center gap-6 bg-white/10 backdrop-blur-xl border border-white/20 px-8 py-6 rounded-3xl shadow-2xl">
            <div className="text-4xl">🎯</div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-white mb-2">Готові спробувати?</h3>
              <p className="text-white/80">Починайте навчання прямо зараз!</p>
            </div>
            <button 
              onClick={() => navigate('/learning')}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3 rounded-2xl font-semibold text-white hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Почати зараз
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
