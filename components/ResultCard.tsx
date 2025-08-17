'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Share2, Download, RefreshCw, Coffee, Heart, Star, BookOpen, Zap } from 'lucide-react'

interface ResultCardProps {
  result: {
    symbol: string
    message: string
    ritual: string
    color: string
  }
  image: string | null
  onReset: () => void
}

const symbolIcons = {
  'Серце': Heart,
  'Ключ': BookOpen,
  'Книга': BookOpen,
  'Зірка': Star,
  'default': Coffee
}

const colorClasses = {
  pink: 'from-pink-400 to-rose-500',
  green: 'from-emerald-400 to-green-500',
  blue: 'from-blue-400 to-indigo-500',
  yellow: 'from-amber-400 to-yellow-500'
}

export default function ResultCard({ result, image, onReset }: ResultCardProps) {
  const [isSharing, setIsSharing] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const SymbolIcon = symbolIcons[result.symbol as keyof typeof symbolIcons] || symbolIcons.default

  const handleShare = async () => {
    setIsSharing(true)
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Моє пророцтво з кавової гущі',
          text: `Сьогодні моя кава показала: ${result.symbol} - ${result.message}`,
          url: window.location.href
        })
      } else {
        // Fallback for browsers without native sharing
        await navigator.clipboard.writeText(
          `Сьогодні моя кава показала: ${result.symbol} - ${result.message}`
        )
        alert('Пророцтво скопійовано в буфер обміну!')
      }
    } catch (error) {
      console.error('Error sharing:', error)
    } finally {
      setIsSharing(false)
    }
  }

  const handleDownload = () => {
    setIsDownloading(true)
    
    // Create a canvas to generate the shareable image
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (ctx) {
      canvas.width = 1080
      canvas.height = 1920
      
      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, '#fef7f0')
      gradient.addColorStop(1, '#fdecd8')
      
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Add some coffee-themed elements
      ctx.fillStyle = '#8B4513'
      ctx.beginPath()
      ctx.arc(canvas.width / 2, canvas.height * 0.3, 200, 0, 2 * Math.PI)
      ctx.fill()
      
      // Add text
      ctx.fillStyle = '#1e293b'
      ctx.font = 'bold 48px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('Кавомант', canvas.width / 2, canvas.height * 0.6)
      
      ctx.font = '36px Arial'
      ctx.fillText(result.symbol, canvas.width / 2, canvas.height * 0.7)
      
      ctx.font = '24px Arial'
      ctx.fillStyle = '#64748b'
      ctx.fillText(result.message.substring(0, 50) + '...', canvas.width / 2, canvas.height * 0.8)
      
      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = 'kavomant-prophecy.png'
          a.click()
          URL.revokeObjectURL(url)
        }
        setIsDownloading(false)
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="mb-6"
        >
          <div className={`
            w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br ${colorClasses[result.color as keyof typeof colorClasses]}
            flex items-center justify-center shadow-2xl
          `}>
            <SymbolIcon className="w-16 h-16 text-white" />
          </div>
          
          <h2 className="text-5xl font-bold text-mystic-800 mb-4 font-mystic">
            {result.symbol}
          </h2>
          
          <p className="text-xl text-mystic-600">
            Твоє пророцтво на сьогодні
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Result Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Message */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-cream-200">
            <h3 className="text-2xl font-bold text-mystic-800 mb-4 font-mystic">
              Послання кави
            </h3>
            <p className="text-lg text-mystic-700 leading-relaxed">
              {result.message}
            </p>
          </div>

          {/* Ritual */}
          <div className="bg-gradient-to-br from-coffee-50 to-cream-100 rounded-2xl p-8 border border-coffee-200">
            <h3 className="text-2xl font-bold text-mystic-800 mb-4 font-mystic flex items-center">
              <Coffee className="w-6 h-6 mr-3 text-coffee-600" />
              Ритуал дня
            </h3>
            <p className="text-lg text-mystic-700 leading-relaxed mb-4">
              {result.ritual}
            </p>
            <div className="bg-white rounded-xl p-4">
              <p className="text-sm text-mystic-600">
                💡 Цей ритуал допоможе закріпити енергію пророцтва та принести удачу
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              disabled={isSharing}
              className="flex-1 bg-gradient-to-r from-coffee-500 to-coffee-600 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Share2 className="w-5 h-5" />
              <span>{isSharing ? 'Ділимося...' : 'Поділитися'}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex-1 bg-gradient-to-r from-mystic-500 to-mystic-600 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>{isDownloading ? 'Завантажуємо...' : 'Зберегти'}</span>
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="w-full bg-gradient-to-r from-cream-400 to-cream-500 text-mystic-800 px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Нове пророцтво</span>
          </motion.button>
        </motion.div>

        {/* Image and Share Card Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          {/* Original Image */}
          {image && (
            <div className="bg-white rounded-2xl p-4 shadow-xl">
              <h3 className="text-lg font-semibold text-mystic-800 mb-4 text-center">
                Твоя кавова гуща
              </h3>
              <img
                src={image}
                alt="Кавова гуща"
                className="w-full h-64 object-cover rounded-xl"
              />
            </div>
          )}

          {/* Share Card Preview */}
          <div className="bg-gradient-to-br from-cream-50 to-coffee-100 rounded-2xl p-6 border border-coffee-200">
            <h3 className="text-lg font-semibold text-mystic-800 mb-4 text-center">
              Картка для шарингу
            </h3>
            
            <div className="bg-white rounded-xl p-4 text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-coffee-400 to-coffee-600 flex items-center justify-center">
                <SymbolIcon className="w-8 h-8 text-white" />
              </div>
              
              <h4 className="font-bold text-mystic-800 text-lg">
                {result.symbol}
              </h4>
              
              <p className="text-sm text-mystic-600 leading-relaxed">
                {result.message.substring(0, 80)}...
              </p>
              
              <div className="text-xs text-coffee-600 font-medium">
                #Кавомант #Пророцтва
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center mt-12"
      >
        <div className="inline-flex items-center space-x-2 bg-coffee-100 px-4 py-2 rounded-full">
          <span className="text-xs text-coffee-800">
            ⚠️ Це розвага, не медичні або фінансові поради
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}
