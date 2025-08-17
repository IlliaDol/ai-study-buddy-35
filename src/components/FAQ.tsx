import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const navigate = useNavigate()

  const faqs = [
    {
      question: "Як працює AI Study Buddy?",
      answer: "AI Study Buddy використовує штучний інтелект для аналізу вашої теми та створення персоналізованого плану навчання. Просто опишіть, що хочете вивчити, і система згенерує структуровані курси, флешкартки та тести."
    },
    {
      question: "Чи потрібна реєстрація для використання?",
      answer: "Ні, реєстрація не обов'язкова! Ви можете почати навчання одразу, просто описавши тему. Реєстрація дає доступ до додаткових функцій, таких як збереження прогресу та синхронізація між пристроями."
    },
    {
      question: "Які мови підтримуються?",
      answer: "Платформа підтримує українську, англійську та німецьку мови. AI може створювати навчальні матеріали та пояснення на будь-якій з цих мов."
    },
    {
      question: "Чи можна створювати власні курси?",
      answer: "Так! Ви можете створювати власні курси, додавати матеріали, редагувати контент та ділитися ними з іншими користувачами. AI допоможе структурувати та оптимізувати ваші курси."
    },
    {
      question: "Як відстежується прогрес навчання?",
      answer: "Система автоматично відстежує ваш прогрес, показує статистику проходження, час навчання та успішність. Ви отримуєте детальну аналітику та рекомендації для покращення результатів."
    },
    {
      question: "Чи безпечні мої дані?",
      answer: "Так, ми серйозно ставимося до безпеки даних. Вся інформація шифрується, не передається третім особам та використовується тільки для покращення якості навчання."
    },
    {
      question: "Чи можна використовувати на мобільних пристроях?",
      answer: "Так, платформа повністю адаптивна та працює на всіх пристроях - комп'ютерах, планшетах та смартфонах. Інтерфейс автоматично адаптується під розмір екрану."
    },
    {
      question: "Як часто оновлюється контент?",
      answer: "AI постійно аналізує нові джерела та оновлює навчальні матеріали. Крім того, ми регулярно додаємо нові функції та покращення на основі зворотного зв'язку користувачів."
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-cyan-400/5 to-blue-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-purple-400/5 to-pink-400/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Часті <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">питання</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Відповіді на найпопулярніші питання про нашу платформу
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="group bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-white/50 transition-colors duration-300"
              >
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-slate-700 transition-colors duration-300">
                  {faq.question}
                </h3>
                <div className={`w-6 h-6 rounded-full border-2 border-slate-300 flex items-center justify-center transition-all duration-300 ${
                  openIndex === index 
                    ? 'border-cyan-500 bg-cyan-500 text-white rotate-45' 
                    : 'group-hover:border-cyan-400'
                }`}>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </button>
              
              <div className={`transition-all duration-500 ease-in-out ${
                openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="px-8 pb-6">
                  <div className="w-16 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 mb-4"></div>
                  <p className="text-slate-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white px-8 py-6 rounded-3xl shadow-2xl">
            <div className="text-4xl">💬</div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-white mb-2">Залишилися питання?</h3>
              <p className="text-white/80">Наша команда підтримки готова допомогти!</p>
            </div>
            <button 
              onClick={() => navigate('/learning')}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 rounded-2xl font-semibold text-white hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Почати навчання
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
