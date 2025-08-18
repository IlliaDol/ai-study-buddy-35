'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, Zap, Crown, Coffee, Sparkles, Check } from 'lucide-react'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  intent: {
    id: string
    title: string
    subtitle: string
  }
}

const plans = [
  {
    id: 'single',
    name: 'Одноразове пророцтво',
    price: 0.99,
    currency: 'USD',
    description: 'Отримайте детальне пророцтво для вашого намерения',
    features: [
      'Детальне AI пророцтво',
      'Астрологічні деталі',
      'Персональні поради',
      'Доступ 24 години'
    ],
    icon: Coffee,
    color: 'from-blue-500 to-blue-600',
    popular: false
  },
  {
    id: 'package5',
    name: 'Пакет 5 пророцтв',
    price: 3.99,
    currency: 'USD',
    description: 'Економічний пакет для регулярних запитів',
    features: [
      '5 детальних пророцтв',
      'Збереження історії',
      'Порівняння результатів',
      'Доступ 30 днів'
    ],
    icon: Sparkles,
    color: 'from-purple-500 to-purple-600',
    popular: true
  },
  {
    id: 'premium',
    name: 'Premium місяць',
    price: 9.99,
    currency: 'USD',
    description: 'Необмежена кількість пророцтв та розширені можливості',
    features: [
      'Необмежена кількість пророцтв',
      'Детальна аналітика',
      'Експертні поради',
      'Пріоритетна підтримка',
      'Доступ 30 днів'
    ],
    icon: Star,
    color: 'from-amber-500 to-amber-600',
    popular: false
  },
  {
    id: 'vip',
    name: 'VIP місяць',
    price: 19.99,
    currency: 'USD',
    description: 'Повний доступ до всіх функцій та ексклюзивний контент',
    features: [
      'Все з Premium',
      'Ексклюзивні ритуали',
      'Персональний астролог',
      'Групові сесії',
      'Доступ 30 днів'
    ],
    icon: Crown,
    color: 'from-rose-500 to-rose-600',
    popular: false
  }
]

export default function PaymentModal({ isOpen, onClose, intent }: PaymentModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handlePayment = async (planId: string) => {
    setLoading(true)
    try {
      // Тут буде інтеграція зі Stripe
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          plan: planId, 
          intent: intent.id,
          intentTitle: intent.title 
        })
      })
      
      if (response.ok) {
        const session = await response.json()
        // Перенаправлення на Stripe Checkout
        window.location.href = session.url
      } else {
        throw new Error('Payment failed')
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Помилка оплати. Спробуйте ще раз.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-coffee-500 to-coffee-600 text-white p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    Оберіть план для {intent.title}
                  </h2>
                  <p className="text-coffee-100 text-lg">
                    {intent.subtitle}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Plans Grid */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {plans.map((plan) => {
                  const IconComponent = plan.icon
                  return (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: plans.indexOf(plan) * 0.1 }}
                      className={`
                        relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300
                        ${selectedPlan === plan.id 
                          ? 'border-coffee-500 shadow-2xl shadow-coffee-500/30' 
                          : 'border-gray-200 hover:border-coffee-300 hover:shadow-xl'
                        }
                        ${plan.popular ? 'ring-2 ring-amber-400 ring-offset-2' : ''}
                      `}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      {/* Popular Badge */}
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-amber-400 text-amber-900 px-3 py-1 rounded-full text-sm font-bold">
                            🏆 Популярний
                          </span>
                        </div>
                      )}

                      {/* Plan Icon */}
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>

                      {/* Plan Details */}
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {plan.name}
                        </h3>
                        <div className="mb-4">
                          <span className="text-4xl font-bold text-gray-900">
                            ${plan.price}
                          </span>
                          <span className="text-gray-500 ml-1">
                            {plan.currency}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {plan.description}
                        </p>
                      </div>

                      {/* Features */}
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-700">
                            <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      {/* Selection Indicator */}
                      <div className={`
                        w-6 h-6 mx-auto rounded-full border-2 transition-all duration-300
                        ${selectedPlan === plan.id 
                          ? 'border-coffee-500 bg-coffee-500' 
                          : 'border-gray-300'
                        }
                      `}>
                        {selectedPlan === plan.id && (
                          <Check className="w-4 h-4 text-white mx-auto mt-0.5" />
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Payment Button */}
              {selectedPlan && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 text-center"
                >
                  <button
                    onClick={() => handlePayment(selectedPlan)}
                    disabled={loading}
                    className="
                      bg-gradient-to-r from-coffee-500 to-coffee-600 text-white px-12 py-4 rounded-full
                      text-xl font-semibold shadow-2xl shadow-coffee-500/30 transition-all duration-300
                      hover:from-coffee-600 hover:to-coffee-700 hover:shadow-coffee-500/50
                      disabled:opacity-50 disabled:cursor-not-allowed
                    "
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Обробка...</span>
                      </div>
                    ) : (
                      `Оплатити ${plans.find(p => p.id === selectedPlan)?.price}$`
                    )}
                  </button>
                  
                  <p className="text-gray-500 text-sm mt-3">
                    Безпечна оплата через Stripe • Можна скасувати в будь-який час
                  </p>
                </motion.div>
              )}

              {/* Additional Info */}
              <div className="mt-8 p-6 bg-gradient-to-r from-coffee-50 to-cream-50 rounded-2xl border border-coffee-200">
                <h4 className="text-lg font-semibold text-coffee-800 mb-3 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-coffee-600" />
                  Що включено в кожен план?
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-coffee-700">
                  <div>
                    <p>✅ AI аналіз кофейної гущі</p>
                    <p>✅ Персональні пророцтва</p>
                    <p>✅ Астрологічні деталі</p>
                  </div>
                  <div>
                    <p>✅ Збереження історії</p>
                    <p>✅ Мобільна версія</p>
                    <p>✅ 24/7 доступ</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
