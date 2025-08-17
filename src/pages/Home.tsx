import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Hero from '../components/Hero'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'

export default function Home() {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'features', 'how-it-works', 'faq']
      const scrollPosition = window.scrollY + 100

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i])
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i])
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen">
      <main className="flex-1">
        <Hero />
        
        {/* Quick Access Section */}
        <section id="quick-access" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-cyan-400/5 to-blue-400/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-purple-400/5 to-pink-400/5 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Швидкий <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">доступ</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Оберіть, що хочете вивчити прямо зараз
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* AI Course Generator */}
              <div className="group relative bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10 text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-4xl">🚀</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">AI Генератор Курсів</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Опишіть тему, яку хочете вивчити, і наш AI створить персоналізований курс навчання з уроками, тестами та практичними завданнями.
                  </p>
                  
                  <button 
                    onClick={() => navigate('/learning')}
                    className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105"
                  >
                    Створити курс
                  </button>
                </div>
              </div>

              {/* Language Lab */}
              <div className="group relative bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10 text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-4xl">🌍</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Мовна Лабораторія</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Вивчайте іноземні мови з AI-помічником. Флешкартки, граматика, розмови та вимова для 5+ мов.
                  </p>
                  
                  <button 
                    onClick={() => navigate('/language-lab')}
                    className="w-full px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105"
                  >
                    Почати вивчення мов
                  </button>
                </div>
              </div>

              {/* Quick Study */}
              <div className="group relative bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10 text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-4xl">⚡</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Швидке Навчання</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Готові набори флешкарток та тести для швидкого повторення матеріалу. Ідеально для перерв та коротких сесій.
                  </p>
                  
                  <button 
                    onClick={() => navigate('/quick-study')}
                    className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
                  >
                    Швидке навчання
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Features Grid */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl p-6 text-center hover:bg-white/80 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">Цілеспрямованість</h4>
                <p className="text-sm text-slate-600">Ставте цілі та відстежуйте прогрес</p>
              </div>

              <div className="bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl p-6 text-center hover:bg-white/80 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🧠</span>
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">Адаптивність</h4>
                <p className="text-sm text-slate-600">AI адаптується до вашого рівня</p>
              </div>

              <div className="bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl p-6 text-center hover:bg-white/80 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📱</span>
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">Мобільність</h4>
                <p className="text-sm text-slate-600">Навчайтесь на будь-якому пристрої</p>
              </div>

              <div className="bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl p-6 text-center hover:bg-white/80 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏆</span>
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">Досягнення</h4>
                <p className="text-sm text-slate-600">Заробляйте нагороди та бейджі</p>
              </div>
            </div>
          </div>
        </section>

        {/* Learning Statistics */}
        <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,119,198,0.2),transparent_50%)]"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Наші <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">досягнення</span>
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Платформа, якій довіряють тисячі студентів по всьому світу
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-cyan-400 mb-4">50K+</div>
                <div className="text-white/80 text-lg">Активних студентів</div>
              </div>
              
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-purple-400 mb-4">1000+</div>
                <div className="text-white/80 text-lg">Курсів створено</div>
              </div>
              
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-emerald-400 mb-4">25+</div>
                <div className="text-white/80 text-lg">Мов підтримується</div>
              </div>
              
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-orange-400 mb-4">98%</div>
                <div className="text-white/80 text-lg">Задоволених користувачів</div>
              </div>
            </div>
          </div>
        </section>

        <Features />
        <HowItWorks />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}
