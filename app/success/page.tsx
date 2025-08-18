'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Star, Coffee, Sparkles, Crown, ArrowRight, Download, Share2 } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

function SuccessPageContent() {
  const searchParams = useSearchParams()
  const [planDetails, setPlanDetails] = useState<any>(null)
  
  const sessionId = searchParams.get('session_id')
  const intent = searchParams.get('intent')
  const plan = searchParams.get('plan')

  useEffect(() => {
    if (plan) {
      const planInfo = {
        single: { name: 'Одноразове пророцтво', icon: Coffee, color: 'from-blue-500 to-blue-600' },
        package5: { name: 'Пакет 5 пророцтв', icon: Sparkles, color: 'from-purple-500 to-purple-600' },
        premium: { name: 'Premium місяць', icon: Star, color: 'from-amber-500 to-amber-600' },
        vip: { name: 'VIP місяць', icon: Crown, color: 'from-rose-500 to-rose-600' }
      }
      setPlanDetails(planInfo[plan as keyof typeof planInfo])
    }
  }, [plan])

  const intentNames = {
    love: 'Любов',
    money: 'Гроші',
    education: 'Освіта',
    luck: 'Удача'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-coffee-100 to-cream-200 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="w-24 h-24 mx-auto mb-8 bg-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/30"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>

          <h1 className="text-5xl font-bold text-mystic-800 mb-6 font-mystic">
            Оплата успішна! 🎉
          </h1>
          
          <p className="text-xl text-mystic-600 max-w-2xl mx-auto leading-relaxed">
            Дякуємо за довіру! Ваше замовлення обробляється та скоро ви отримаєте доступ до містичних пророцтв.
          </p>
        </motion.div>

        {/* Order Details */}
        {planDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl shadow-2xl p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-mystic-800 mb-6 text-center">
              Деталі замовлення
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Plan Info */}
              <div className="text-center">
                <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${planDetails.color} flex items-center justify-center`}>
                  <planDetails.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-mystic-800 mb-2">
                  {planDetails.name}
                </h3>
                <p className="text-mystic-600">
                  Ваш план активовано
                </p>
              </div>

              {/* Intent Info */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-coffee-500 to-coffee-600 flex items-center justify-center">
                  <Coffee className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-mystic-800 mb-2">
                  {intentNames[intent as keyof typeof intentNames] || intent}
                </h3>
                <p className="text-mystic-600">
                  Ваше намерение
                </p>
              </div>
            </div>

            {/* Session ID */}
            {sessionId && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-2">ID сесії оплати:</p>
                <p className="font-mono text-sm bg-white p-2 rounded border">
                  {sessionId}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-coffee-100 to-cream-100 rounded-3xl p-8 mb-8 border border-coffee-200"
        >
          <h3 className="text-2xl font-bold text-coffee-800 mb-6 text-center">
            Що далі? 🚀
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-coffee-400 to-coffee-600 rounded-full flex items-center justify-center">
                <Download className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-coffee-800">1. Завантажте фото</h4>
              <p className="text-coffee-600 text-sm">Зробіть знімок вашої кофейної гущі</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-coffee-400 to-coffee-600 rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-coffee-800">2. Отримайте пророцтво</h4>
              <p className="text-coffee-600 text-sm">AI проаналізує та дасть детальну відповідь</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-coffee-400 to-coffee-600 rounded-full flex items-center justify-center">
                <Share2 className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-coffee-800">3. Поділіться результатом</h4>
              <p className="text-coffee-600 text-sm">Розкажіть друзям про CoffeeOracle</p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center space-y-4"
        >
          <Link href="/">
            <button className="bg-gradient-to-r from-coffee-500 to-coffee-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-2xl shadow-coffee-500/30 transition-all duration-300 hover:from-coffee-600 hover:to-coffee-700 hover:shadow-coffee-500/50">
              <ArrowRight className="w-5 h-5 inline mr-2" />
              Почати нове пророцтво
            </button>
          </Link>
          
          <div className="flex items-center justify-center space-x-4 text-sm text-mystic-500">
            <span>Підтримка:</span>
            <a href="mailto:hello@coffeeoracle.org" className="text-coffee-600 hover:text-coffee-700 underline">
              hello@coffeeoracle.org
            </a>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-12 p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/50 text-center"
        >
          <p className="text-mystic-700 leading-relaxed">
            🌟 Ваше замовлення буде оброблено протягом 24 годин. Ви отримаєте email з деталями та інструкціями.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-cream-50 via-coffee-100 to-cream-200 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-coffee-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-mystic-600">Завантаження...</p>
        </div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  )
}
