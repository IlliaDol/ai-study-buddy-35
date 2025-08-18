'use client'

import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { XCircle, ArrowLeft, RefreshCw, Coffee, Heart } from 'lucide-react'
import Link from 'next/link'

export default function CancelPage() {
  const searchParams = useSearchParams()
  const intent = searchParams.get('intent')

  const intentNames = {
    love: 'Любов',
    money: 'Гроші',
    education: 'Освіта',
    luck: 'Удача'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-coffee-100 to-cream-200 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Cancel Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="w-24 h-24 mx-auto mb-8 bg-red-500 rounded-full flex items-center justify-center shadow-2xl shadow-red-500/30"
          >
            <XCircle className="w-12 h-12 text-white" />
          </motion.div>

          <h1 className="text-5xl font-bold text-mystic-800 mb-6 font-mystic">
            Оплата скасована 😔
          </h1>
          
          <p className="text-xl text-mystic-600 max-w-2xl mx-auto leading-relaxed">
            Не хвилюйтеся! Ви можете спробувати ще раз або обрати інший план. Ваші дані не були збережені.
          </p>
        </motion.div>

        {/* Intent Info */}
        {intent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl shadow-2xl p-8 mb-8 text-center"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-coffee-500 to-coffee-600 flex items-center justify-center">
              <Coffee className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-mystic-800 mb-2">
              Ваше намерение: {intentNames[intent as keyof typeof intentNames] || intent}
            </h2>
            <p className="text-mystic-600">
              Готові спробувати ще раз?
            </p>
          </motion.div>
        )}

        {/* Why Cancel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-red-50 to-pink-50 rounded-3xl p-8 mb-8 border border-red-200"
        >
          <h3 className="text-2xl font-bold text-red-800 mb-6 text-center">
            Чому оплата не пройшла? 🤔
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-red-600 text-sm font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-red-800">Технічні проблеми</h4>
                  <p className="text-red-600 text-sm">Тимчасові збої в платіжній системі</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-red-600 text-sm font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-red-800">Недостатньо коштів</h4>
                  <p className="text-red-600 text-sm">Перевірте баланс вашої картки</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-red-600 text-sm font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-red-800">Блокування банку</h4>
                  <p className="text-red-600 text-sm">Ваш банк може блокувати онлайн платежі</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-red-600 text-sm font-bold">4</span>
                </div>
                <div>
                  <h4 className="font-semibold text-red-800">Помилка введення</h4>
                  <p className="text-red-600 text-sm">Перевірте правильність даних картки</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Solutions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-coffee-100 to-cream-100 rounded-3xl p-8 mb-8 border border-coffee-200"
        >
          <h3 className="text-2xl font-bold text-coffee-800 mb-6 text-center">
            Що робити далі? 💡
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-coffee-400 to-coffee-600 rounded-full flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-coffee-800">Спробувати ще раз</h4>
              <p className="text-coffee-600 text-sm">Використати ту ж картку або іншу</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-coffee-400 to-coffee-600 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-coffee-800">Обрати інший план</h4>
              <p className="text-coffee-600 text-sm">Можливо, краще підійде безкоштовний варіант</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-coffee-400 to-coffee-600 rounded-full flex items-center justify-center">
                <Coffee className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-coffee-800">Зв'язатися з підтримкою</h4>
              <p className="text-coffee-600 text-sm">Ми допоможемо вирішити проблему</p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="text-center space-y-4"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/">
              <button className="bg-gradient-to-r from-coffee-500 to-coffee-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-2xl shadow-coffee-500/30 transition-all duration-300 hover:from-coffee-600 hover:to-coffee-700 hover:shadow-coffee-500/50">
                <ArrowLeft className="w-5 h-5 inline mr-2" />
                Повернутися на головну
              </button>
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-2xl shadow-gray-500/30 transition-all duration-300 hover:from-gray-600 hover:to-gray-700 hover:shadow-gray-500/50"
            >
              <RefreshCw className="w-5 h-5 inline mr-2" />
              Спробувати ще раз
            </button>
          </div>
          
          <div className="flex items-center justify-center space-x-4 text-sm text-mystic-500">
            <span>Потрібна допомога?</span>
            <a href="mailto:hello@coffeeoracle.org" className="text-coffee-600 hover:text-coffee-700 underline">
              hello@coffeeoracle.org
            </a>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12 p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/50 text-center"
        >
          <p className="text-mystic-700 leading-relaxed">
            🌟 Не хвилюйтеся, ваші дані залишаються в безпеці. Спробуйте ще раз або зв'яжіться з нами для отримання допомоги.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
