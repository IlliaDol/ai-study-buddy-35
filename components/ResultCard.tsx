'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Share2, Download, RefreshCw, Coffee, Heart, Star, BookOpen, Zap, Sparkles, Crown, Gift, Moon } from 'lucide-react'

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
  'Heart': Heart,
  'Key': BookOpen,
  'Book': BookOpen,
  'Star': Star,
  'default': Coffee
}

const colorClasses = {
  pink: 'from-pink-400 to-rose-500',
  green: 'from-emerald-400 to-green-500',
  blue: 'from-blue-400 to-indigo-500',
  yellow: 'from-amber-400 to-yellow-500'
}

const colorNames = {
  pink: 'Pink',
  green: 'Green',
  blue: 'Blue',
  yellow: 'Yellow'
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
          title: 'My Coffee Ground Prophecy',
          text: `Today my coffee showed: ${result.symbol} - ${result.message}`,
          url: window.location.href
        })
      } else {
        // Fallback for browsers without native sharing
        await navigator.clipboard.writeText(
          `Today my coffee showed: ${result.symbol} - ${result.message}`
        )
        alert('Prophecy copied to clipboard!')
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
      ctx.fillText('CoffeeOracle', canvas.width / 2, canvas.height * 0.6)
      
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
          a.download = 'coffeeoracle-prophecy.png'
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
      className="max-w-6xl mx-auto"
    >
      {/* Header with animation */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className={`
              w-36 h-36 mx-auto mb-8 rounded-full bg-gradient-to-br ${colorClasses[result.color as keyof typeof colorClasses]}
              flex items-center justify-center shadow-2xl shadow-black/20 relative
            `}
          >
            <SymbolIcon className="w-20 h-20 text-white" />
            
            {/* Animated rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 w-44 h-44 border-4 border-current rounded-full opacity-20"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 w-40 h-40 border-2 border-current rounded-full opacity-30"
            />
            
            {/* Decorative elements */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"
            >
              <Crown className="w-4 h-4 text-yellow-800" />
            </motion.div>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl font-bold text-mystic-800 mb-6 font-mystic bg-gradient-to-r from-coffee-600 to-mystic-800 bg-clip-text text-transparent"
          >
            {result.symbol}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl text-mystic-600 mb-4"
          >
            Your prophecy for today
          </motion.p>

          {/* Color and energy */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="inline-flex items-center space-x-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/50"
          >
            <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${colorClasses[result.color as keyof typeof colorClasses]}`} />
            <span className="text-sm text-mystic-600 font-medium">
              Energy: {colorNames[result.color as keyof typeof colorNames]}
            </span>
          </motion.div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Result Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
          className="space-y-8"
        >
          {/* Message */}
          <motion.div 
            className="bg-white rounded-3xl p-8 shadow-2xl border border-cream-200 relative overflow-hidden group"
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Background effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-coffee-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <motion.h3 
                className="text-3xl font-bold text-mystic-800 mb-6 font-mystic flex items-center"
                whileHover={{ scale: 1.05 }}
              >
                <Sparkles className="w-8 h-8 mr-3 text-coffee-500" />
                Coffee Message
              </motion.h3>
              <p className="text-xl text-mystic-700 leading-relaxed">
                {result.message}
              </p>
            </div>
          </motion.div>

          {/* Ritual */}
          <motion.div 
            className="bg-gradient-to-br from-coffee-50 to-cream-100 rounded-3xl p-8 border border-coffee-200 shadow-xl relative overflow-hidden group"
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Background effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-coffee-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <motion.h3 
                className="text-3xl font-bold text-mystic-800 mb-6 font-mystic flex items-center"
                whileHover={{ scale: 1.05 }}
              >
                <Coffee className="w-8 h-8 mr-3 text-coffee-600" />
                Daily Ritual
              </motion.h3>
              <p className="text-xl text-mystic-700 leading-relaxed mb-6">
                {result.ritual}
              </p>
              <motion.div 
                className="bg-white rounded-2xl p-6 border border-coffee-100"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start space-x-3">
                  <Gift className="w-6 h-6 text-coffee-500 mt-1 flex-shrink-0" />
                  <p className="text-mystic-600 leading-relaxed">
                    💡 This ritual will help strengthen the energy of the prophecy and bring luck to your life
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Actions */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                disabled={isSharing}
                className="flex-1 bg-gradient-to-r from-coffee-500 via-coffee-600 to-coffee-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-2xl shadow-coffee-500/30 hover:shadow-3xl hover:shadow-coffee-500/40 transition-all duration-300 flex items-center justify-center space-x-3 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center space-x-3">
                  <Share2 className="w-6 h-6" />
                  <span className="text-lg">{isSharing ? 'Sharing...' : 'Share'}</span>
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-coffee-600 to-coffee-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex-1 bg-gradient-to-r from-mystic-500 via-mystic-600 to-mystic-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-2xl shadow-mystic-500/30 hover:shadow-3xl hover:shadow-mystic-500/40 transition-all duration-300 flex items-center justify-center space-x-3 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center space-x-3">
                  <Download className="w-6 h-6" />
                  <span className="text-lg">{isDownloading ? 'Downloading...' : 'Save'}</span>
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-mystic-600 to-mystic-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </motion.button>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={onReset}
              className="w-full bg-gradient-to-r from-cream-400 via-cream-500 to-cream-600 text-mystic-800 px-8 py-4 rounded-2xl font-semibold shadow-2xl shadow-cream-500/30 hover:shadow-3xl hover:shadow-cream-500/40 transition-all duration-300 flex items-center justify-center space-x-3"
            >
              <RefreshCw className="w-6 h-6" />
              <span className="text-lg">New Prophecy</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Image and Share Card Preview */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
          className="space-y-8"
        >
          {/* Original Image */}
          {image && (
            <motion.div 
              className="bg-white rounded-3xl p-6 shadow-2xl border border-cream-200"
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.h3 
                className="text-xl font-semibold text-mystic-800 mb-6 text-center flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
              >
                <Moon className="w-6 h-6 mr-2 text-coffee-500" />
                Your Coffee Grounds
              </motion.h3>
              <div className="relative group">
                <img
                  src={image}
                  alt="Coffee grounds"
                  className="w-full h-80 object-cover rounded-2xl shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-coffee-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              </div>
            </motion.div>
          )}

          {/* Share Card Preview */}
          <motion.div 
            className="bg-gradient-to-br from-cream-50 to-coffee-100 rounded-3xl p-8 border border-coffee-200 shadow-xl"
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.h3 
              className="text-xl font-semibold text-mystic-800 mb-6 text-center flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-6 h-6 mr-2 text-coffee-500" />
              Share Card
            </motion.h3>
            
            <motion.div 
              className="bg-white rounded-2xl p-6 text-center space-y-4 shadow-lg"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div 
                className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-coffee-400 to-coffee-600 flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <SymbolIcon className="w-10 h-10 text-white" />
              </motion.div>
              
              <h4 className="font-bold text-mystic-800 text-xl">
                {result.symbol}
              </h4>
              
              <p className="text-sm text-mystic-600 leading-relaxed">
                {result.message.substring(0, 80)}...
              </p>
              
              <div className="text-xs text-coffee-600 font-medium bg-coffee-50 px-3 py-2 rounded-full">
                #CoffeeOracle #Prophecies
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
        className="text-center mt-16"
      >
        <motion.div 
          className="inline-flex items-center space-x-3 bg-gradient-to-r from-coffee-100 to-cream-100 px-6 py-3 rounded-2xl border border-coffee-200 shadow-lg"
          whileHover={{ scale: 1.05, y: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <span className="text-amber-500">⚠️</span>
          <span className="text-sm text-coffee-800 font-medium">
            This is entertainment, not medical or financial advice
          </span>
        </motion.div>

        {/* Additional information */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-8 p-6 bg-white/30 backdrop-blur-sm rounded-2xl border border-white/50 max-w-2xl mx-auto"
        >
          <p className="text-mystic-600 text-sm text-center leading-relaxed">
            🌟 Each prophecy is unique and created specifically for you. AI analyzed your coffee grounds and revealed the secrets of your future
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
