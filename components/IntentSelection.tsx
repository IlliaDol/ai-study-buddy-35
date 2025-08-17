'use client'

import { motion } from 'framer-motion'
import { Heart, DollarSign, GraduationCap, Zap, ArrowLeft } from 'lucide-react'

type Intent = 'love' | 'money' | 'education' | 'luck'

interface IntentSelectionProps {
  onSelect: (intent: Intent) => void
}

const intents = [
  {
    id: 'love' as Intent,
    icon: Heart,
    title: 'Кохання',
    description: 'Стосунки, дружба, самопізнання',
    color: 'from-pink-400 to-rose-500',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200'
  },
  {
    id: 'money' as Intent,
    icon: DollarSign,
    title: 'Гроші',
    description: 'Кар\'єра, фінанси, можливості',
    color: 'from-emerald-400 to-green-500',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200'
  },
  {
    id: 'education' as Intent,
    icon: GraduationCap,
    title: 'Навчання',
    description: 'Знання, мудрість, розвиток',
    color: 'from-blue-400 to-indigo-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    id: 'luck' as Intent,
    icon: Zap,
    title: 'Удача',
    description: 'Випадки, пригоди, несподіванки',
    color: 'from-amber-400 to-yellow-500',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200'
  }
]

export default function IntentSelection({ onSelect }: IntentSelectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-mystic-800 mb-4 font-mystic"
        >
          Про що думаєш сьогодні?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-mystic-600"
        >
          Виберіть намір, який допоможе AI точніше прочитати твою каву
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {intents.map((intent, index) => (
          <motion.div
            key={intent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(intent.id)}
            className={`
              ${intent.bgColor} ${intent.borderColor}
              border-2 rounded-2xl p-8 cursor-pointer transition-all duration-300
              hover:shadow-xl hover:shadow-black/5
            `}
          >
            <div className="text-center">
              <div className={`
                w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br ${intent.color}
                flex items-center justify-center shadow-lg
              `}>
                <intent.icon className="w-10 h-10 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-mystic-800 mb-3">
                {intent.title}
              </h3>
              
              <p className="text-mystic-600 text-lg leading-relaxed">
                {intent.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center"
      >
        <p className="text-mystic-500 text-sm mb-4">
          💡 Порада: Виберіть те, що найбільше хвилює вас зараз
        </p>
        
        <div className="flex items-center justify-center space-x-2 text-xs text-mystic-400">
          <div className="w-2 h-2 bg-coffee-300 rounded-full animate-pulse"></div>
          <span>AI проаналізує гущу з урахуванням вашого наміру</span>
        </div>
      </motion.div>
    </motion.div>
  )
}
