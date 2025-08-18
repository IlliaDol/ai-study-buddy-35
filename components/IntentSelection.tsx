'use client'

import { motion } from 'framer-motion'
import { Heart, DollarSign, GraduationCap, Zap, ArrowLeft, Sparkles, Star, Moon, Coffee, Eye, Brain, Crown, Gift } from 'lucide-react'

type Intent = 'love' | 'money' | 'education' | 'luck'

interface IntentSelectionProps {
  onSelect: (intent: Intent) => void
}

const intents = [
  {
    id: 'love' as Intent,
    icon: Heart,
    title: 'Love',
    description: 'Relationships, friendship, self-discovery',
    longDescription: 'Reveals the secrets of your heart, helps you understand relationships and find the path to happiness in love',
    color: 'from-pink-400 to-rose-500',
    bgColor: 'bg-gradient-to-br from-pink-50 to-rose-50',
    borderColor: 'border-pink-200',
    shadowColor: 'shadow-pink-200/50',
    glowColor: 'from-pink-400/20 to-rose-500/20',
    keywords: ['heart', 'love', 'relationships', 'friendship', 'family'],
    elements: ['Venus', 'Rose', 'Heart', 'Couple'],
    timeOfDay: 'Evening',
    season: 'Spring',
    chakra: 'Heart Chakra'
  },
  {
    id: 'money' as Intent,
    icon: DollarSign,
    title: 'Money',
    description: 'Career, finances, opportunities',
    longDescription: 'Shows the path to financial prosperity, reveals career opportunities and helps you find sources of abundance',
    color: 'from-emerald-400 to-green-500',
    bgColor: 'bg-gradient-to-br from-emerald-50 to-green-50',
    borderColor: 'border-emerald-200',
    shadowColor: 'shadow-emerald-200/50',
    glowColor: 'from-emerald-400/20 to-green-500/20',
    keywords: ['money', 'career', 'business', 'investments', 'success'],
    elements: ['Jupiter', 'Oak', 'Key', 'Coin'],
    timeOfDay: 'Morning',
    season: 'Summer',
    chakra: 'Solar Plexus'
  },
  {
    id: 'education' as Intent,
    icon: GraduationCap,
    title: 'Education',
    description: 'Knowledge, wisdom, development',
    longDescription: 'Opens doors to new knowledge, helps you understand your talents and find the path to personal development',
    color: 'from-blue-400 to-indigo-500',
    bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
    borderColor: 'border-blue-200',
    shadowColor: 'shadow-blue-200/50',
    glowColor: 'from-blue-400/20 to-indigo-500/20',
    keywords: ['knowledge', 'wisdom', 'learning', 'talent', 'development'],
    elements: ['Mercury', 'Book', 'Pen', 'Candle'],
    timeOfDay: 'Day',
    season: 'Autumn',
    chakra: 'Throat Chakra'
  },
  {
    id: 'luck' as Intent,
    icon: Zap,
    title: 'Luck',
    description: 'Chances, adventures, surprises',
    longDescription: 'Reveals the secrets of luck, helps you see opportunities and find the path to unexpected adventures',
    color: 'from-amber-400 to-yellow-500',
    bgColor: 'bg-gradient-to-br from-amber-50 to-yellow-50',
    borderColor: 'border-amber-200',
    shadowColor: 'shadow-amber-200/50',
    glowColor: 'from-amber-400/20 to-yellow-500/20',
    keywords: ['luck', 'adventures', 'chances', 'opportunities', 'magic'],
    elements: ['Jupiter', 'Star', 'Clover', 'Moon'],
    timeOfDay: 'Night',
    season: 'Winter',
    chakra: 'Crown Chakra'
  }
]

export default function IntentSelection({ onSelect }: IntentSelectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto"
    >
      {/* Enhanced header with animation */}
      <div className="text-center mb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="mb-8"
        >
          {/* Central icon with effects */}
          <div className="relative mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 w-40 h-40 mx-auto border-4 border-coffee-200 rounded-full opacity-20"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 w-32 h-32 mx-auto border-2 border-coffee-300 rounded-full opacity-30"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 w-24 h-24 mx-auto border border-coffee-400 rounded-full opacity-40"
            />
            
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="relative z-10 w-28 h-28 mx-auto bg-gradient-to-br from-coffee-500 to-coffee-600 rounded-full flex items-center justify-center shadow-2xl shadow-coffee-500/30"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Coffee className="w-14 h-14 text-white" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-6xl font-bold text-mystic-800 mb-8 font-mystic bg-gradient-to-r from-coffee-600 to-mystic-800 bg-clip-text text-transparent"
        >
          What are you thinking about today?
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-2xl text-mystic-600 max-w-3xl mx-auto leading-relaxed mb-8"
        >
          Choose an intent that will help AI read your coffee more accurately and reveal the secrets of your future
        </motion.p>

        {/* Additional information */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="inline-flex items-center space-x-4 bg-gradient-to-r from-coffee-100 to-cream-100 px-8 py-4 rounded-2xl border border-coffee-200 shadow-lg"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Eye className="w-6 h-6 text-coffee-600" />
          </motion.div>
          <span className="text-coffee-700 font-medium text-lg">
            AI will analyze the grounds considering your intent
          </span>
          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Brain className="w-6 h-6 text-coffee-600" />
          </motion.div>
        </motion.div>
      </div>

      {/* Intent cards with enhanced design */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        {intents.map((intent, index) => (
          <motion.div
            key={intent.id}
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: 0.1 * index, 
              type: "spring", 
              stiffness: 100,
              damping: 15
            }}
            whileHover={{ 
              scale: 1.03, 
              y: -12,
              transition: { type: "spring", stiffness: 300 }
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(intent.id)}
            className={`
              ${intent.bgColor} ${intent.borderColor}
              border-2 rounded-3xl p-10 cursor-pointer transition-all duration-500
              hover:shadow-3xl hover:shadow-black/15 relative overflow-hidden group
              backdrop-blur-sm
            `}
          >
            {/* Background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${intent.glowColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            {/* Decorative elements */}
            <motion.div 
              className="absolute top-6 right-6 opacity-20 group-hover:opacity-40 transition-opacity duration-300"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-20 h-20 border border-current rounded-full" />
            </motion.div>
            
            <div className="relative z-10">
              {/* Card header */}
              <div className="text-center mb-8">
                <motion.div 
                  className={`
                    w-28 h-28 mx-auto mb-6 rounded-full bg-gradient-to-br ${intent.color}
                    flex items-center justify-center shadow-2xl shadow-black/20
                    group-hover:shadow-3xl group-hover:shadow-black/30
                    transition-all duration-500 relative
                  `}
                  whileHover={{ 
                    scale: 1.15, 
                    rotate: 10,
                    transition: { type: "spring", stiffness: 300 }
                  }}
                >
                  <intent.icon className="w-14 h-14 text-white" />
                  
                  {/* Animated rings */}
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 border-2 border-white rounded-full opacity-30"
                  />
                </motion.div>
                
                <motion.h3 
                  className="text-4xl font-bold text-mystic-800 mb-4 group-hover:text-mystic-900 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  {intent.title}
                </motion.h3>
                
                <motion.p 
                  className="text-xl text-mystic-600 mb-6 group-hover:text-mystic-700 transition-colors duration-300 leading-relaxed"
                  whileHover={{ scale: 1.02 }}
                >
                  {intent.description}
                </motion.p>

                {/* Extended description */}
                <motion.p 
                  className="text-mystic-600 text-lg leading-relaxed mb-6 opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                >
                  {intent.longDescription}
                </motion.p>
              </div>

              {/* Detailed information */}
              <div className="space-y-6">
                {/* Keywords */}
                <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
                  <h4 className="font-semibold text-mystic-800 mb-3 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-coffee-500" />
                    Key Themes
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {intent.keywords.map((keyword, idx) => (
                      <motion.span
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * idx }}
                        className="px-3 py-1 bg-coffee-100 text-coffee-700 rounded-full text-sm font-medium"
                      >
                        {keyword}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Astrological elements */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                    <h5 className="font-semibold text-mystic-800 mb-2 text-sm">Planet</h5>
                    <p className="text-mystic-600 text-sm">{intent.elements[0]}</p>
                  </div>
                  <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                    <h5 className="font-semibold text-mystic-800 mb-2 text-sm">Symbol</h5>
                    <p className="text-mystic-600 text-sm">{intent.elements[1]}</p>
                  </div>
                  <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                    <h5 className="font-semibold text-mystic-800 mb-2 text-sm">Time of Day</h5>
                    <p className="text-mystic-600 text-sm">{intent.timeOfDay}</p>
                  </div>
                  <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                    <h5 className="font-semibold text-mystic-800 mb-2 text-sm">Season</h5>
                    <p className="text-mystic-600 text-sm">{intent.season}</p>
                  </div>
                </div>

                {/* Chakra */}
                <div className="bg-gradient-to-r from-coffee-50 to-cream-50 rounded-xl p-4 border border-coffee-200">
                  <h5 className="font-semibold text-mystic-800 mb-2 flex items-center">
                    <Crown className="w-4 h-4 mr-2 text-coffee-500" />
                    Energy Center
                  </h5>
                  <p className="text-mystic-600 text-sm">{intent.chakra}</p>
                </div>
              </div>

              {/* Selection indicator */}
              <motion.div
                className="mt-8 w-12 h-12 mx-auto border-4 border-current rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                whileHover={{ scale: 1.3 }}
              />
            </div>

            {/* Hover effect */}
            <motion.div
              className="absolute inset-0 border-2 border-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"
              style={{
                background: `linear-gradient(45deg, transparent, ${intent.borderColor.replace('border-', '')}, transparent)`
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Additional information and tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="text-center space-y-8"
      >
        {/* Main tip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 }}
          className="inline-flex items-center space-x-4 bg-gradient-to-r from-coffee-100 to-cream-100 px-8 py-6 rounded-2xl border border-coffee-200 shadow-xl"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Gift className="w-8 h-8 text-coffee-600" />
          </motion.div>
          <div className="text-left">
            <p className="text-coffee-700 font-semibold text-lg">
              💡 Tip: Choose what concerns you most right now
            </p>
            <p className="text-coffee-600 text-sm mt-1">
              Your intent tunes AI to a specific energy and helps create a more accurate prophecy
            </p>
          </div>
        </motion.div>
        
        {/* Process indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="flex items-center justify-center space-x-4 text-sm text-mystic-500"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-4 h-4 bg-coffee-400 rounded-full"
          />
          <span className="font-medium">AI will analyze the grounds considering your intent</span>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="w-4 h-4 bg-coffee-400 rounded-full"
          />
        </motion.div>

        {/* Additional information */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="mt-12 p-8 bg-white/40 backdrop-blur-sm rounded-3xl border border-white/50 max-w-4xl mx-auto"
        >
          <h3 className="text-2xl font-bold text-mystic-800 mb-6 text-center flex items-center justify-center">
            <Star className="w-7 h-7 mr-3 text-coffee-500" />
            How does coffee magic work?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-3">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-coffee-400 to-coffee-600 rounded-full flex items-center justify-center">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-mystic-800">Pattern Analysis</h4>
              <p className="text-mystic-600 text-sm">AI studies every swirl and shape in the coffee grounds</p>
            </div>
            <div className="space-y-3">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-coffee-400 to-coffee-600 rounded-full flex items-center justify-center">
                <Brain className="w-8 h-8 text-white" />
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
        </motion.div>

        {/* Final tip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="mt-8 p-6 bg-gradient-to-r from-mystic-50 to-coffee-50 rounded-2xl border border-mystic-200 max-w-2xl mx-auto"
        >
          <p className="text-mystic-700 text-center leading-relaxed">
            🌟 Each intent has its own special energy. AI will consider this when analyzing your coffee grounds and provide a more accurate and personalized prophecy that reveals the secrets of your future.
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
