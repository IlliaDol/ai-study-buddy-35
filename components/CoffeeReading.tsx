'use client'

import { motion } from 'framer-motion'
import { Coffee, Sparkles, Eye, Brain, Heart } from 'lucide-react'

type Intent = 'love' | 'money' | 'education' | 'luck' | null

interface CoffeeReadingProps {
  image: string | null
  intent: Intent | null
}

const intentEmojis = {
  love: '❤️',
  money: '💰',
  education: '📚',
  luck: '✨'
}

const intentColors = {
  love: 'from-pink-400 to-rose-500',
  money: 'from-emerald-400 to-green-500',
  education: 'from-blue-400 to-indigo-500',
  luck: 'from-amber-400 to-yellow-500'
}

const analysisSteps = [
  {
    icon: Eye,
    title: 'Аналіз зображення',
    description: 'Знаходжу контури та форми в кавовій гущі',
    delay: 0
  },
  {
    icon: Brain,
    title: 'Визначення символів',
    description: 'Ідентифікую архетипи та архетипічні форми',
    delay: 0.5
  },
  {
    icon: Heart,
    title: 'Персоналізація',
    description: 'Адаптую тлумачення під твій намір',
    delay: 1
  },
  {
    icon: Sparkles,
    title: 'Генерація пророцтва',
    description: 'Створюю унікальне послання для тебе',
    delay: 1.5
  }
]

export default function CoffeeReading({ image, intent }: CoffeeReadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="mb-6"
        >
          <div className={`
            w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br ${intentColors[intent!]}
            flex items-center justify-center text-4xl
          `}>
            {intentEmojis[intent!]}
          </div>
          
          <h2 className="text-4xl font-bold text-mystic-800 mb-4 font-mystic">
            AI читає твою каву
          </h2>
          
          <p className="text-xl text-mystic-600">
            Аналізую візерунки та шукаю символи для твого наміру
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Image Display */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          {image && (
            <div className="relative">
              <img
                src={image}
                alt="Кавова гуща"
                className="w-full h-80 object-cover rounded-2xl shadow-2xl"
              />
              
              {/* Overlay with coffee cup effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-coffee-900/20 to-transparent rounded-2xl"></div>
              
              {/* Steam effect */}
              <motion.div
                animate={{ y: [-10, -30, -10] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 left-1/4 w-2 h-8 bg-gradient-to-b from-white/60 to-transparent rounded-full"
              />
              <motion.div
                animate={{ y: [-15, -35, -15] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -top-4 left-1/3 w-2 h-6 bg-gradient-to-b from-white/60 to-transparent rounded-full"
              />
              <motion.div
                animate={{ y: [-8, -25, -8] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -top-4 left-2/4 w-2 h-7 bg-gradient-to-b from-white/60 to-transparent rounded-full"
              />
            </div>
          )}
          
          <div className="mt-4 text-center">
            <p className="text-sm text-mystic-500">
              Фото завантажено успішно
            </p>
          </div>
        </motion.div>

        {/* Analysis Steps */}
        <div className="space-y-6">
          {analysisSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: step.delay }}
              className="flex items-start space-x-4"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  delay: step.delay,
                  ease: "easeInOut"
                }}
                className={`
                  w-12 h-12 rounded-full bg-gradient-to-br ${intentColors[intent!]}
                  flex items-center justify-center flex-shrink-0
                `}
              >
                <step.icon className="w-6 h-6 text-white" />
              </motion.div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-mystic-800 mb-2">
                  {step.title}
                </h3>
                <p className="text-mystic-600">
                  {step.description}
                </p>
                
                {/* Progress indicator */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ 
                    duration: 1.5, 
                    delay: step.delay + 0.5,
                    ease: "easeInOut"
                  }}
                  className="h-1 bg-gradient-to-r from-coffee-400 to-coffee-600 rounded-full mt-3"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5 }}
        className="text-center mt-12"
      >
        <div className="inline-flex items-center space-x-3 bg-coffee-100 px-6 py-3 rounded-full">
          <Coffee className="w-5 h-5 text-coffee-600" />
          <span className="text-coffee-800 font-medium">
            Магія кави розкриває твоє майбутнє...
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}
