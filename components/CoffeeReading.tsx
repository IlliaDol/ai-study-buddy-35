'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Coffee, Sparkles, Zap, Star, Moon, CheckCircle, Save, Heart } from 'lucide-react'
import SaveReadingModal from './SaveReadingModal'
import { Intent } from '@/types'

interface CoffeeReadingProps {
  image: string | null
  intent: Intent | null
}

const intentNames = {
  love: 'Love',
  money: 'Money',
  education: 'Education',
  luck: 'Luck',
  health: 'Health',
  travel: 'Travel',
  creativity: 'Creativity',
  spirituality: 'Spirituality',
  family: 'Family',
  friendship: 'Friendship'
}

const analysisSteps = [
  {
    step: 1,
    title: 'Pattern Recognition',
    description: 'AI analyzes every swirl and contour in your coffee grounds',
    icon: Coffee,
    color: 'from-coffee-400 to-coffee-600'
  },
  {
    step: 2,
    title: 'Symbol Interpretation',
    description: 'Identifying archetypes and mystical symbols in the patterns',
    icon: Sparkles,
    color: 'from-mystic-400 to-mystic-600'
  },
  {
    step: 3,
    title: 'Intent Integration',
    description: 'Combining your chosen intent with the discovered symbols',
    icon: Star,
    color: 'from-amber-400 to-yellow-500'
  },
  {
    step: 4,
    title: 'Prophecy Generation',
    description: 'Creating your personalized daily prophecy',
    icon: Moon,
    color: 'from-indigo-400 to-purple-500'
  }
]

export default function CoffeeReading({ image, intent }: CoffeeReadingProps) {
  const [showSaveModal, setShowSaveModal] = useState(false)

  // Симулюємо згенероване пророцтво
  const generatedReading = {
    title: "Ваше містичне пророцтво",
    content: "На основі аналізу вашої кавової гущі, AI розкриває таємниці вашого майбутнього. У вас є особливий дар бачити крізь час та простір. Цей дар допоможе вам знайти правильний шлях у житті та зробити правильні вибори. Ваша інтуїція зараз особливо сильна - довіряйте їй. В найближчому майбутньому вас чекають значні зміни, які приведуть до позитивних результатів. Зберігайте оптимізм та віру в себе.",
    intent: intent ? intentNames[intent] : 'Unknown',
    timestamp: new Date().toLocaleString('uk-UA'),
    image: image || undefined
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto"
    >
      {/* Header with animation */}
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-coffee-500 to-coffee-600 rounded-full flex items-center justify-center shadow-2xl shadow-coffee-500/30 relative"
          >
            <Coffee className="w-16 h-16 text-white" />
            
            {/* Animated rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 w-40 h-40 border-4 border-coffee-200 rounded-full opacity-20"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 w-32 h-32 border-2 border-coffee-300 rounded-full opacity-30"
            />
          </motion.div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-5xl font-bold text-mystic-800 mb-6 font-mystic bg-gradient-to-r from-coffee-600 to-mystic-800 bg-clip-text text-transparent"
        >
          AI is Reading Your Coffee
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-2xl text-mystic-600 max-w-3xl mx-auto leading-relaxed mb-8"
        >
          Analyzing patterns and searching for symbols for your intent: <span className="font-semibold text-coffee-600">{intentNames[intent!]}</span>
        </motion.p>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center space-x-4 mb-8"
        >
          <Star className="w-6 h-6 text-coffee-400 animate-pulse" />
          <Moon className="w-6 h-6 text-mystic-400 animate-pulse" />
          <Star className="w-6 h-6 text-coffee-400 animate-pulse" />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Image Display */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
          className="space-y-6"
        >
          <motion.h3 
            className="text-3xl font-bold text-mystic-800 mb-6 text-center"
            whileHover={{ scale: 1.05 }}
          >
            Your Coffee Grounds
          </motion.h3>
          
          {image && (
            <motion.div 
              className="relative group"
              whileHover={{ scale: 1.02 }}
            >
              <motion.img
                src={image}
                alt="Coffee grounds"
                className="w-full h-96 object-cover rounded-3xl shadow-2xl border-4 border-coffee-200"
                whileHover={{ scale: 1.05 }}
              />
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-coffee-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
              
              {/* Steam effects */}
              <motion.div
                animate={{ y: [-10, -20, -10] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 left-1/4 w-8 h-8 bg-gradient-to-b from-white/60 via-white/40 to-transparent rounded-full opacity-60"
              />
              <motion.div
                animate={{ y: [-15, -25, -15] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -top-6 left-1/2 w-6 h-6 bg-gradient-to-b from-white/60 via-white/40 to-transparent rounded-full opacity-50"
              />
              <motion.div
                animate={{ y: [-8, -18, -8] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.0 }}
                className="absolute -top-3 right-1/4 w-7 h-7 bg-gradient-to-b from-white/60 via-white/40 to-transparent rounded-full opacity-70"
              />
            </motion.div>
          )}

          {/* Success message */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center p-4 bg-gradient-to-r from-coffee-100 to-cream-100 rounded-2xl border border-coffee-200"
          >
            <div className="flex items-center justify-center space-x-2 text-coffee-700">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Photo uploaded successfully!</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Analysis Steps */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
          className="space-y-8"
        >
          <motion.h3 
            className="text-3xl font-bold text-mystic-800 mb-8 text-center"
            whileHover={{ scale: 1.05 }}
          >
            Analysis Progress
          </motion.h3>
          
          <div className="space-y-6">
            {analysisSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-start space-x-4 p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/50 hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                
                <div className="flex-1">
                  <motion.h4 
                    className="text-xl font-semibold text-mystic-800 mb-2"
                    whileHover={{ scale: 1.02 }}
                  >
                    {step.title}
                  </motion.h4>
                  <motion.p 
                    className="text-mystic-600 leading-relaxed"
                    whileHover={{ scale: 1.01 }}
                  >
                    {step.description}
                  </motion.p>
                </div>
                
                <div className="w-8 h-8 bg-coffee-100 rounded-full flex items-center justify-center text-coffee-600 font-bold text-sm">
                  {step.step}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.0 }}
            className="mt-8 p-6 bg-gradient-to-r from-coffee-50 to-cream-50 rounded-2xl border border-coffee-200"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-coffee-700 font-semibold">Analysis Progress</span>
              <span className="text-coffee-600 text-sm">75%</span>
            </div>
            <div className="w-full bg-coffee-200 rounded-full h-2 shadow-lg">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "75%" }}
                transition={{ duration: 2, delay: 0.5 }}
                className="bg-gradient-to-r from-coffee-500 to-coffee-600 h-2 rounded-full shadow-lg"
              />
            </div>
            <p className="text-coffee-600 text-sm mt-3 text-center">
              AI is processing your coffee grounds and creating a personalized prophecy...
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom message */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 100 }}
        className="text-center mt-16"
      >
        <motion.div 
          className="inline-flex items-center space-x-3 bg-gradient-to-r from-coffee-100 to-cream-100 px-8 py-4 rounded-2xl border border-coffee-200 shadow-lg"
          whileHover={{ scale: 1.05, y: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Sparkles className="w-6 h-6 text-coffee-500" />
          <span className="text-coffee-700 font-medium">
            Your prophecy is being prepared with care and precision
          </span>
        </motion.div>

        {/* Additional information */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-8 p-6 bg-white/30 backdrop-blur-sm rounded-2xl border border-white/50 max-w-2xl mx-auto"
        >
          <p className="text-mystic-600 text-sm text-center leading-relaxed">
            🌟 Each prophecy is unique and created specifically for you. AI analyzes your coffee grounds and reveals the secrets of your future
          </p>
        </motion.div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6 }}
        className="text-center mt-8"
      >
        <button
          onClick={() => setShowSaveModal(true)}
          className="
            bg-gradient-to-r from-coffee-500 to-coffee-600 text-white px-8 py-4 rounded-full
            text-lg font-semibold shadow-2xl shadow-coffee-500/30 transition-all duration-300
            hover:from-coffee-600 hover:to-coffee-700 hover:shadow-coffee-500/50 hover:scale-105
            flex items-center space-x-3 mx-auto
          "
        >
          <Save className="w-5 h-5" />
          <span>Зберегти пророцтво</span>
          <Heart className="w-5 h-5" />
        </button>
        
        <p className="text-coffee-600 text-sm mt-3">
          Збережіть ваше містичне знання для майбутнього
        </p>
      </motion.div>

      {/* Save Reading Modal */}
      <SaveReadingModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        reading={generatedReading}
      />
    </motion.div>
  )
}
