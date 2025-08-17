import { useNavigate } from 'react-router-dom'
import Hero from '../components/Hero'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen">
      <main className="flex-1">
        <Hero />
        
        {/* Quick Access Section */}
        <section id="quick-access" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
          
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
              <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">🚀</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">AI Генератор Курсів</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Опишіть тему, яку хочете вивчити, і наш AI створить персоналізований курс навчання з уроками, тестами та практичними завданнями.
                  </p>
                  
                  <button 
                    onClick={() => navigate('/learning')}
                    className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Створити курс
                  </button>
                </div>
              </div>

              {/* Language Lab */}
              <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">🌍</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Мовна Лабораторія</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Вивчайте іноземні мови з AI-помічником. Флешкартки, граматика, розмови та вимова для 5+ мов.
                  </p>
                  
                  <button 
                    onClick={() => navigate('/language-lab')}
                    className="w-full px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Почати вивчення мов
                  </button>
                </div>
              </div>

              {/* Quick Study */}
              <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">⚡</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Швидке Навчання</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Готові набори флешкарток та тести для швидкого повторення матеріалу. Ідеально для перерв та коротких сесій.
                  </p>
                  
                  <button 
                    onClick={() => navigate('/quick-study')} 
                    className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Швидке навчання
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Features Grid */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">Цілеспрямованість</h4>
                <p className="text-sm text-slate-600">Ставте цілі та відстежуйте прогрес</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🧠</span>
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">Адаптивність</h4>
                <p className="text-sm text-slate-600">AI адаптується до вашого рівня</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📱</span>
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">Мобільність</h4>
                <p className="text-sm text-slate-600">Навчайтесь на будь-якому пристрої</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏆</span>
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">Досягнення</h4>
                <p className="text-sm text-slate-600">Заробляйте нагороди та бейджі</p>
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
