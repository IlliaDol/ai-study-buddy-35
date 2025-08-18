'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, Share2, Heart, Star, Coffee, Save, BookOpen, Sparkles } from 'lucide-react'

interface SaveReadingModalProps {
  isOpen: boolean
  onClose: () => void
  reading: {
    title: string
    content: string
    intent: string
    timestamp: string
    image?: string
  }
}

export default function SaveReadingModal({ isOpen, onClose, reading }: SaveReadingModalProps) {
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      // Тут буде логіка збереження в базу даних
      // Поки що симулюємо збереження
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSaved(true)
      
      // Автоматично закриваємо через 2 секунди
      setTimeout(() => {
        onClose()
        setSaved(false)
      }, 2000)
    } catch (error) {
      console.error('Save error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    // Створюємо текст для завантаження
    const text = `
🌟 CoffeeOracle - Пророцтво з кавової гущі

📅 Дата: ${reading.timestamp}
🎯 Намерение: ${reading.intent}
✨ Заголовок: ${reading.title}

${reading.content}

---
Згенеровано на CoffeeOracle.org
Ваш містичний провідник у світі пророцтв
    `.trim()

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `coffee-reading-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Пророцтво: ${reading.title}`,
          text: reading.content.substring(0, 100) + '...',
          url: 'https://coffeoracle.org'
        })
      } catch (error) {
        console.log('Share cancelled')
      }
    } else {
      // Fallback для браузерів без Web Share API
      navigator.clipboard.writeText(
        `Пророцтво: ${reading.title}\n\n${reading.content}\n\nhttps://coffeoracle.org`
      )
      alert('Пророцтво скопійовано в буфер обміну!')
    }
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
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-cream-50 via-coffee-100 to-cream-200 rounded-3xl shadow-2xl border-2 border-coffee-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-coffee-500 to-coffee-600 text-white p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold mb-1">
                      Зберегти пророцтво
                    </h2>
                    <p className="text-coffee-100 text-lg">
                      Ваше містичне знання готове до збереження
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Reading Preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 mb-6 shadow-xl border border-coffee-200"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-coffee-400 to-coffee-600 rounded-full flex items-center justify-center">
                    <Coffee className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-coffee-800">
                      {reading.title}
                    </h3>
                    <p className="text-coffee-600 text-sm">
                      Намерение: {reading.intent}
                    </p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-coffee-50 to-cream-50 rounded-xl p-4 border border-coffee-100">
                  <p className="text-coffee-800 leading-relaxed text-sm">
                    {reading.content.substring(0, 200)}...
                  </p>
                </div>
                
                <div className="mt-4 text-xs text-coffee-500">
                  📅 Згенеровано: {reading.timestamp}
                </div>
              </motion.div>

              {/* Save Options */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
              >
                {/* Save to Account */}
                <div className="bg-white rounded-xl p-4 text-center border-2 border-coffee-200 hover:border-coffee-400 transition-colors">
                  <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-coffee-400 to-coffee-600 rounded-full flex items-center justify-center">
                    <Save className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-coffee-800 mb-2">
                    Зберегти в акаунті
                  </h4>
                  <p className="text-coffee-600 text-sm">
                    Доступ до всіх ваших пророцтв
                  </p>
                </div>

                {/* Download */}
                <div 
                  onClick={handleDownload}
                  className="bg-white rounded-xl p-4 text-center border-2 border-coffee-200 hover:border-coffee-400 transition-colors cursor-pointer hover:shadow-lg"
                >
                  <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                    <Download className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-coffee-800 mb-2">
                    Завантажити
                  </h4>
                  <p className="text-coffee-600 text-sm">
                    Зберегти як текстовий файл
                  </p>
                </div>

                {/* Share */}
                <div 
                  onClick={handleShare}
                  className="bg-white rounded-xl p-4 text-center border-2 border-coffee-200 hover:border-coffee-400 transition-colors cursor-pointer hover:shadow-lg"
                >
                  <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                    <Share2 className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-coffee-800 mb-2">
                    Поділитися
                  </h4>
                  <p className="text-coffee-600 text-sm">
                    Відправити друзям
                  </p>
                </div>
              </motion.div>

              {/* Main Save Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-center"
              >
                {!saved ? (
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="
                      bg-gradient-to-r from-coffee-500 to-coffee-600 text-white px-12 py-4 rounded-full
                      text-xl font-semibold shadow-2xl shadow-coffee-500/30 transition-all duration-300
                      hover:from-coffee-600 hover:to-coffee-700 hover:shadow-coffee-500/50
                      disabled:opacity-50 disabled:cursor-not-allowed
                    "
                  >
                    {loading ? (
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Зберігаю...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <Heart className="w-6 h-6" />
                        <span>Зберегти пророцтво</span>
                      </div>
                    )}
                  </button>
                ) : (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-green-500 text-white px-8 py-4 rounded-full text-xl font-semibold shadow-2xl"
                  >
                    <div className="flex items-center space-x-3">
                      <Star className="w-6 h-6" />
                      <span>Пророцтво збережено! ✨</span>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Additional Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/50 text-center"
              >
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <Sparkles className="w-5 h-5 text-coffee-600" />
                  <h4 className="text-lg font-semibold text-coffee-800">
                    Чому варто зберегти?
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-coffee-700">
                  <div>
                    <p>🔮 Порівняння з майбутнім</p>
                    <p>📚 Особиста історія пророцтв</p>
                  </div>
                  <div>
                    <p>🌟 Відстеження змін</p>
                    <p>💫 Розвиток інтуїції</p>
                  </div>
                  <div>
                    <p>📱 Доступ з будь-якого пристрою</p>
                    <p>🔄 Повторне читання</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
