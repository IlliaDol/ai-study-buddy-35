'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Check, Coffee, CreditCard, Shield, Sparkles, Star, X, Zap } from 'lucide-react'
import { useState } from 'react'

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
    description: 'Детальне AI пророцтво для вашого намерения',
    features: ['AI аналіз', 'Астрологічні деталі', 'Персональні поради'],
    icon: Coffee,
    color: 'bg-blue-500',
    popular: false
  },
  {
    id: 'package5',
    name: 'Пакет 5 пророцтв',
    price: 3.99,
    currency: 'USD',
    description: 'Економічний пакет для регулярних запитів',
    features: ['5 пророцтв', 'Збереження історії', 'Порівняння результатів'],
    icon: Sparkles,
    color: 'bg-purple-500',
    popular: true
  },
  {
    id: 'premium',
    name: 'Premium місяць',
    price: 9.99,
    currency: 'USD',
    description: 'Необмежена кількість пророцтв',
    features: ['Необмежено пророцтв', 'Детальна аналітика', 'Експертні поради'],
    icon: Star,
    color: 'bg-amber-500',
    popular: false
  }
]

export default function PaymentModal({ isOpen, onClose, intent }: PaymentModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showWidget, setShowWidget] = useState(false)
  const [paymentData, setPaymentData] = useState<any>(null)

  const handlePayment = async (planId: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/create-nowpayment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: planId,
          intent: intent.id,
          intentTitle: intent.title
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Помилка створення оплати')
      }

      const payment = await response.json()
      setPaymentData(payment)
      setShowWidget(true)
    } catch (error: any) {
      console.error('Payment error:', error)
      setError(error.message || 'Помилка створення оплати. Спробуйте ще раз.')
    } finally {
      setLoading(false)
    }
  }

  const resetPayment = () => {
    setShowWidget(false)
    setPaymentData(null)
    setError(null)
    setSelectedPlan(null)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    💫 Оберіть план для {intent.title}
                  </h2>
                  <p className="text-blue-100">
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

            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-red-700 text-sm">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
                >
                  Закрити
                </button>
              </motion.div>
            )}

            {/* Plans Selection */}
            {!showWidget && (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {plans.map((plan) => {
                    const IconComponent = plan.icon
                    const isSelected = selectedPlan === plan.id

                    return (
                      <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: plans.indexOf(plan) * 0.1 }}
                        whileHover={{ y: -5 }}
                        className={`
                          relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300
                          ${isSelected
                            ? 'border-blue-500 shadow-lg shadow-blue-500/20 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300 hover:shadow-lg bg-white'
                          }
                          ${plan.popular ? 'ring-2 ring-amber-400 ring-offset-2' : ''}
                        `}
                        onClick={() => setSelectedPlan(plan.id)}
                      >
                        {/* Popular Badge */}
                        {plan.popular && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <div className="bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-900 px-3 py-1 rounded-full text-xs font-bold">
                              🏆 Популярний
                            </div>
                          </div>
                        )}

                        {/* Plan Icon */}
                        <div className={`w-12 h-12 mx-auto mb-4 rounded-full ${plan.color} flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>

                        {/* Plan Details */}
                        <div className="text-center mb-4">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {plan.name}
                          </h3>
                          <div className="mb-3">
                            <span className="text-3xl font-bold text-gray-900">
                              ${plan.price}
                            </span>
                            <span className="text-gray-500 ml-1 text-sm">
                              {plan.currency}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm">
                            {plan.description}
                          </p>
                        </div>

                        {/* Features */}
                        <ul className="space-y-2 mb-4">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center text-sm text-gray-700">
                              <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>

                        {/* Selection Indicator */}
                        <div className={`
                          w-5 h-5 mx-auto rounded-full border-2 transition-all duration-300
                          ${isSelected
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                          }
                        `}>
                          {isSelected && (
                            <Check className="w-3 h-3 text-white mx-auto mt-0.5" />
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
                    className="text-center"
                  >
                    <button
                      onClick={() => handlePayment(selectedPlan)}
                      disabled={loading}
                      className="
                        bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full
                        text-lg font-semibold shadow-lg transition-all duration-300
                        hover:from-blue-700 hover:to-purple-700 hover:shadow-xl hover:scale-105
                        disabled:opacity-50 disabled:cursor-not-allowed
                        flex items-center justify-center mx-auto space-x-2
                      "
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Обробка...</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5" />
                          <span>Оплатити ${plans.find(p => p.id === selectedPlan)?.price}</span>
                        </>
                      )}
                    </button>

                    <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Shield className="w-4 h-4 mr-1" />
                        Безпечно
                      </div>
                      <div className="flex items-center">
                        <Zap className="w-4 h-4 mr-1" />
                        Швидко
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Payment Widget */}
            {showWidget && paymentData && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6"
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    💳 Оплата криптовалютою
                  </h3>
                  <p className="text-gray-600">
                    Оберіть зручну для вас криптовалюту та завершіть оплату
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="flex justify-center">
                    <iframe
                      src={paymentData.widget_url}
                      width="400"
                      height="600"
                      frameBorder="0"
                      scrolling="no"
                      className="rounded-lg shadow-lg"
                      title="Payment Widget"
                    />
                  </div>
                </div>

                <div className="text-center space-y-4">
                  <button
                    onClick={resetPayment}
                    className="text-blue-600 hover:text-blue-800 underline text-sm"
                  >
                    ← Повернутися до вибору плану
                  </button>

                  <div className="text-xs text-gray-500">
                    <p>• Безпечна оплата через NOWPayments</p>
                    <p>• Підтримка всіх популярних криптовалют</p>
                    <p>• Можна скасувати в будь-який час</p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
