'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, DollarSign, GraduationCap, Zap, Coffee, Sparkles, Star } from 'lucide-react'
import PaymentModal from './PaymentModal'

type Intent = 'love' | 'money' | 'education' | 'luck'

interface IntentSelectionProps {
  onSelect: (intent: Intent) => void
}

const intents = [
  {
    id: 'love' as Intent,
    icon: Heart,
    title: 'Love',
    subtitle: 'Relationships, friendship, self-discovery',
    description: 'Reveals the secrets of your heart, helps you understand relationships and find the path to happiness in love',
    color: 'from-rose-400 to-pink-500',
    bgColor: 'bg-gradient-to-br from-rose-50 to-pink-50',
    borderColor: 'border-rose-200',
    keywords: ['heart', 'love', 'relationships', 'friendship', 'family'],
    planet: 'Venus',
    symbol: 'Rose',
    timeOfDay: 'Evening',
    season: 'Spring',
    chakra: 'Heart Chakra'
  },
  {
    id: 'money' as Intent,
    icon: DollarSign,
    title: 'Money',
    subtitle: 'Career, finances, opportunities',
    description: 'Shows the path to financial prosperity, reveals career opportunities and helps you find sources of abundance',
    color: 'from-emerald-400 to-green-500',
    bgColor: 'bg-gradient-to-br from-emerald-50 to-green-50',
    borderColor: 'border-emerald-200',
    keywords: ['money', 'career', 'business', 'investments', 'success'],
    planet: 'Jupiter',
    symbol: 'Oak',
    timeOfDay: 'Morning',
    season: 'Summer',
    chakra: 'Solar Plexus'
  },
  {
    id: 'education' as Intent,
    icon: GraduationCap,
    title: 'Education',
    subtitle: 'Knowledge, wisdom, development',
    description: 'Opens doors to new knowledge, helps you understand your talents and find the path to personal development',
    color: 'from-blue-400 to-indigo-500',
    bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
    borderColor: 'border-blue-200',
    keywords: ['knowledge', 'wisdom', 'learning', 'talent', 'development'],
    planet: 'Mercury',
    symbol: 'Book',
    timeOfDay: 'Day',
    season: 'Autumn',
    chakra: 'Throat Chakra'
  },
  {
    id: 'luck' as Intent,
    icon: Zap,
    title: 'Luck',
    subtitle: 'Chances, adventures, surprises',
    description: 'Reveals the secrets of luck, helps you see opportunities and find the path to unexpected adventures',
    color: 'from-amber-400 to-yellow-500',
    bgColor: 'bg-gradient-to-br from-amber-50 to-yellow-50',
    borderColor: 'border-amber-200',
    keywords: ['luck', 'adventures', 'chances', 'opportunities', 'magic'],
    planet: 'Jupiter',
    symbol: 'Star',
    timeOfDay: 'Night',
    season: 'Winter',
    chakra: 'Crown Chakra'
  }
]

export default function IntentSelection({ onSelect }: IntentSelectionProps) {
  const [showPayment, setShowPayment] = useState(false)
  const [selectedIntent, setSelectedIntent] = useState<any>(null)

  const handleIntentSelect = (intent: any) => {
    setSelectedIntent(intent)
    setShowPayment(true)
  }

  const handlePaymentClose = () => {
    setShowPayment(false)
    setSelectedIntent(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-coffee-100 to-cream-200 py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          {/* Central icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-coffee-500 to-coffee-600 rounded-full flex items-center justify-center shadow-2xl shadow-coffee-500/30"
          >
            <Coffee className="w-12 h-12 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl font-bold text-mystic-800 mb-6 font-mystic"
          >
            What are you thinking about today?
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-mystic-600 max-w-2xl mx-auto leading-relaxed"
          >
            Choose an intent that will help AI read your coffee more accurately and reveal the secrets of your future
          </motion.p>
        </motion.div>

        {/* Intent Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {intents.map((intent, index) => (
            <motion.div
              key={intent.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index + 0.8 }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleIntentSelect(intent)}
              className={`
                ${intent.bgColor} ${intent.borderColor}
                border-2 rounded-2xl p-8 cursor-pointer transition-all duration-300
                hover:shadow-2xl hover:shadow-black/10 relative overflow-hidden group
              `}
            >
              {/* Card Header */}
              <div className="text-center mb-6">
                <motion.div 
                  className={`
                    w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${intent.color}
                    flex items-center justify-center shadow-lg
                  `}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <intent.icon className="w-10 h-10 text-white" />
                </motion.div>
                
                <h3 className="text-3xl font-bold text-mystic-800 mb-2">
                  {intent.title}
                </h3>
                
                <p className="text-lg text-mystic-600 mb-4">
                  {intent.subtitle}
                </p>

                <p className="text-mystic-600 leading-relaxed">
                  {intent.description}
                </p>
              </div>

              {/* Keywords */}
              <div className="mb-6">
                <h4 className="font-semibold text-mystic-800 mb-3 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-coffee-500" />
                  Key Themes
                </h4>
                <div className="flex flex-wrap gap-2">
                  {intent.keywords.map((keyword, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white/60 text-mystic-700 rounded-full text-sm font-medium"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Astrological Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white/40 rounded-lg p-3">
                  <h5 className="font-semibold text-mystic-800 mb-1">Planet</h5>
                  <p className="text-mystic-600">{intent.planet}</p>
                </div>
                <div className="bg-white/40 rounded-lg p-3">
                  <h5 className="font-semibold text-mystic-800 mb-1">Symbol</h5>
                  <p className="text-mystic-600">{intent.symbol}</p>
                </div>
                <div className="bg-white/40 rounded-lg p-3">
                  <h5 className="font-semibold text-mystic-800 mb-1">Time</h5>
                  <p className="text-mystic-600">{intent.timeOfDay}</p>
                </div>
                <div className="bg-white/40 rounded-lg p-3">
                  <h5 className="font-semibold text-mystic-800 mb-1">Season</h5>
                  <p className="text-mystic-600">{intent.season}</p>
                </div>
              </div>

              {/* Energy Center */}
              <div className="mt-4 bg-white/40 rounded-lg p-3">
                <h5 className="font-semibold text-mystic-800 mb-1">Energy Center</h5>
                <p className="text-mystic-600 text-sm">{intent.chakra}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tips and Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="text-center space-y-8"
        >
          {/* Main Tip */}
          <div className="bg-gradient-to-r from-coffee-100 to-cream-100 px-8 py-6 rounded-2xl border border-coffee-200 shadow-lg max-w-2xl mx-auto">
            <p className="text-coffee-700 font-semibold text-lg mb-2">
              💡 Tip: Choose what concerns you most right now
            </p>
            <p className="text-coffee-600">
              Your intent tunes AI to a specific energy and helps create a more accurate prophecy
            </p>
          </div>

          {/* Process Explanation */}
          <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 border border-white/50 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-mystic-800 mb-6 flex items-center justify-center">
              <Star className="w-6 h-6 mr-3 text-coffee-500" />
              How does coffee magic work?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-3">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-coffee-400 to-coffee-600 rounded-full flex items-center justify-center">
                  <Coffee className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-mystic-800">Pattern Analysis</h4>
                <p className="text-mystic-600 text-sm">AI studies every swirl and shape in the coffee grounds</p>
              </div>
              <div className="space-y-3">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-coffee-400 to-coffee-600 rounded-full flex items-center justify-center">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-mystic-800">Interpretation</h4>
                <p className="text-mystic-600 text-sm">System recognizes symbols and archetypes</p>
              </div>
              <div className="space-y-3">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-coffee-400 to-coffee-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-mystic-800">Personalization</h4>
                <p className="text-mystic-600 text-sm">Prophecy adapts to your intent</p>
              </div>
            </div>
          </div>

          {/* Final Message */}
          <div className="bg-gradient-to-r from-mystic-50 to-coffee-50 rounded-2xl p-6 border border-mystic-200 max-w-2xl mx-auto">
            <p className="text-mystic-700 text-center leading-relaxed">
              🌟 Each intent has its own special energy. AI will consider this when analyzing your coffee grounds and provide a more accurate and personalized prophecy that reveals the secrets of your future.
            </p>
                    </div>
        </motion.div>
      </div>

      {/* Payment Modal */}
      {showPayment && selectedIntent && (
        <PaymentModal
          isOpen={showPayment}
          onClose={handlePaymentClose}
          intent={selectedIntent}
        />
      )}
    </div>
  )
}