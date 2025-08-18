'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, 
  DollarSign, 
  GraduationCap, 
  Star, 
  Heart as HealthHeart, 
  Plane, 
  Palette, 
  Moon, 
  Home, 
  Users,
  ArrowLeft,
  Coffee
} from 'lucide-react'
import { ReadingService } from '@/services/readingService'
import { Intent } from '@/types'

interface IntentSelectionProps {
  onSelect: (intent: Intent) => void
}

const INTENTS: Array<{
  id: Intent
  icon: any
  title: string
  description: string
  color: string
  gradient: string
  popular?: boolean
}> = [
  {
    id: 'love',
    icon: Heart,
    title: 'Любов',
    description: 'Пророцтво про любов, стосунки та серце',
    color: 'pink',
    gradient: 'from-pink-500 to-rose-500',
    popular: true
  },
  {
    id: 'money',
    icon: DollarSign,
    title: 'Гроші',
    description: 'Пророцтво про фінанси, кар\'єру та достаток',
    color: 'green',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    id: 'education',
    icon: GraduationCap,
    title: 'Освіта',
    description: 'Пророцтво про навчання, знання та розвиток',
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'luck',
    icon: Star,
    title: 'Удача',
    description: 'Пророцтво про удачу та можливості',
    color: 'yellow',
    gradient: 'from-yellow-500 to-amber-500'
  },
  {
    id: 'health',
    icon: HealthHeart,
    title: 'Здоров\'я',
    description: 'Пророцтво про здоров\'я та благополуччя',
    color: 'green',
    gradient: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'travel',
    icon: Plane,
    title: 'Подорожі',
    description: 'Пророцтво про подорожі та нові горизонти',
    color: 'cyan',
    gradient: 'from-cyan-500 to-blue-500'
  },
  {
    id: 'creativity',
    icon: Palette,
    title: 'Творчість',
    description: 'Пророцтво про творчість та самовираження',
    color: 'purple',
    gradient: 'from-purple-500 to-violet-500'
  },
  {
    id: 'spirituality',
    icon: Moon,
    title: 'Духовність',
    description: 'Пророцтво про духовність та внутрішній світ',
    color: 'indigo',
    gradient: 'from-indigo-500 to-purple-500'
  },
  {
    id: 'family',
    icon: Home,
    title: 'Сім\'я',
    description: 'Пророцтво про сім\'ю та домашній затишок',
    color: 'orange',
    gradient: 'from-orange-500 to-amber-500'
  },
  {
    id: 'friendship',
    icon: Users,
    title: 'Дружба',
    description: 'Пророцтво про дружбу та соціальні зв\'язки',
    color: 'pink',
    gradient: 'from-rose-500 to-pink-500'
  }
]

export default function IntentSelection({ onSelect }: IntentSelectionProps) {
  const [selectedIntent, setSelectedIntent] = useState<Intent | null>(null)
  const [hoveredIntent, setHoveredIntent] = useState<Intent | null>(null)

  const handleIntentSelect = (intent: Intent) => {
    setSelectedIntent(intent)
    // Small delay for better UX
    setTimeout(() => onSelect(intent), 300)
  }

  const handleBack = () => {
    // This would typically go back to welcome step
    window.history.back()
  }

  const popularIntents = useMemo(() => INTENTS.filter(intent => intent.popular), [])
  const regularIntents = useMemo(() => INTENTS.filter(intent => !intent.popular), [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-coffee-500 to-coffee-600 rounded-full flex items-center justify-center"
        >
          <Coffee className="w-10 h-10 text-white" />
        </motion.div>
        
        <h1 className="text-4xl font-bold text-coffee-800 mb-4">
          Оберіть намір для пророцтва
        </h1>
        
        <p className="text-xl text-coffee-600 mb-6 max-w-2xl mx-auto">
          Кожен намір має своє особливе значення та символіку. 
          Оберіть те, що найбільше хвилює вас зараз.
        </p>
        

      </div>

      {/* Back Button */}
      <div className="mb-8">
        <motion.button
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBack}
          className="inline-flex items-center space-x-2 text-coffee-600 hover:text-coffee-700 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Назад</span>
        </motion.button>
      </div>

      {/* Popular Intents */}
      {popularIntents.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-coffee-800 mb-6 text-center">
            🏆 Популярні наміри
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularIntents.map((intent, index) => (
              <IntentCard
                key={intent.id}
                intent={intent}
                index={index}
                isSelected={selectedIntent === intent.id}
                isHovered={hoveredIntent === intent.id}
                onSelect={handleIntentSelect}
                onHover={setHoveredIntent}
                isPopular={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Intents Grid */}
      <div>
        <h2 className="text-2xl font-bold text-coffee-800 mb-6 text-center">
          Всі наміри
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {regularIntents.map((intent, index) => (
            <IntentCard
              key={intent.id}
              intent={intent}
              index={index + popularIntents.length}
              isSelected={selectedIntent === intent.id}
              isHovered={hoveredIntent === intent.id}
              onSelect={handleIntentSelect}
              onHover={setHoveredIntent}
              isPopular={false}
            />
          ))}
        </div>
      </div>

      {/* Selection Info */}
      <AnimatePresence>
        {selectedIntent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-12 text-center"
          >
            <div className="bg-gradient-to-r from-coffee-50 to-cream-50 rounded-2xl p-6 border border-coffee-200 inline-block">
              <p className="text-coffee-800 font-medium">
                Обрано: <span className="font-bold">{ReadingService.getIntentTitle(selectedIntent)}</span>
              </p>
              <p className="text-coffee-600 text-sm mt-1">
                {ReadingService.getIntentDescription(selectedIntent)}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

interface IntentCardProps {
  intent: {
    id: Intent
    icon: any
    title: string
    description: string
    color: string
    gradient: string
    popular?: boolean
  }
  index: number
  isSelected: boolean
  isHovered: boolean
  onSelect: (intent: Intent) => void
  onHover: (intent: Intent | null) => void
  isPopular: boolean
}

function IntentCard({ 
  intent, 
  index, 
  isSelected, 
  isHovered, 
  onSelect, 
  onHover,
  isPopular 
}: IntentCardProps) {
  const IconComponent = intent.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ 
        scale: 1.05, 
        y: -5,
        transition: { type: "spring", stiffness: 300 }
      }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => onHover(intent.id)}
      onHoverEnd={() => onHover(null)}
      onClick={() => onSelect(intent.id)}
      className={`
        relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-500 group
        ${isSelected 
          ? 'border-coffee-500 shadow-2xl shadow-coffee-500/30 bg-gradient-to-br from-coffee-50 to-cream-50' 
          : 'border-gray-200 hover:border-coffee-300 hover:shadow-2xl hover:shadow-coffee-500/20 bg-white hover:bg-gradient-to-br hover:from-coffee-50/30 hover:to-cream-50/30'
        }
        ${isPopular ? 'ring-2 ring-amber-400 ring-offset-2' : ''}
      `}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-amber-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg border-2 border-amber-300 whitespace-nowrap">
            🏆 Популярний
          </div>
        </div>
      )}

      {/* Icon */}
      <motion.div 
        className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${intent.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
        whileHover={{ 
          scale: 1.1, 
          rotate: 5,
          transition: { type: "spring", stiffness: 300 }
        }}
      >
        <IconComponent className="w-8 h-8 text-white" />
      </motion.div>

      {/* Content */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {intent.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {intent.description}
        </p>
      </div>

      {/* Selection Indicator */}
      <motion.div 
        className={`
          w-6 h-6 mx-auto mt-4 rounded-full border-2 transition-all duration-500
          ${isSelected 
            ? 'border-coffee-500 bg-coffee-500 shadow-lg shadow-coffee-500/50' 
            : 'border-gray-300 group-hover:border-coffee-400'
          }
        `}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
      >
        {isSelected && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-full h-full flex items-center justify-center"
          >
            <div className="w-2 h-2 bg-white rounded-full" />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}