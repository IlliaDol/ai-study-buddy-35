'use client'

import { motion } from 'framer-motion'
import { Coffee, Sparkles } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'coffee' | 'sparkles'
  text?: string
  className?: string
}

export default function LoadingSpinner({ 
  size = 'md', 
  variant = 'default',
  text,
  className = ''
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  const renderSpinner = () => {
    switch (variant) {
      case 'coffee':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className={`${sizeClasses[size]} border-4 border-coffee-200 border-t-coffee-600 rounded-full`}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-full h-full flex items-center justify-center"
            >
              <Coffee className={`${iconSizes[size]} text-coffee-600`} />
            </motion.div>
          </motion.div>
        )
      
      case 'sparkles':
        return (
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className={`${sizeClasses[size]} relative`}
            >
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0"
                  style={{
                    transform: `rotate(${i * 60}deg)`
                  }}
                >
                  <motion.div
                    animate={{ 
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut"
                    }}
                    className="w-2 h-2 bg-coffee-500 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2"
                  />
                </motion.div>
              ))}
              <div className="w-full h-full flex items-center justify-center">
                <Sparkles className={`${iconSizes[size]} text-coffee-600`} />
              </div>
            </motion.div>
          </div>
        )
      
      default:
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className={`${sizeClasses[size]} border-4 border-gray-200 border-t-coffee-600 rounded-full`}
          />
        )
    }
  }

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      {renderSpinner()}
      
      {text && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 text-center font-medium"
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}

// Спеціалізовані варіанти для різних сценаріїв
export function CoffeeReadingSpinner({ text = "Аналізую кофейну гущу..." }: { text?: string }) {
  return (
    <div className="text-center space-y-6">
      <LoadingSpinner variant="coffee" size="lg" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="space-y-3"
      >
        <p className="text-xl font-semibold text-coffee-800">{text}</p>
        <div className="flex items-center justify-center space-x-2">
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-2 h-2 bg-coffee-400 rounded-full"
          />
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            className="w-2 h-2 bg-coffee-400 rounded-full"
          />
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
            className="w-2 h-2 bg-coffee-400 rounded-full"
          />
        </div>
      </motion.div>
    </div>
  )
}

export function PaymentProcessingSpinner({ text = "Обробляю оплату..." }: { text?: string }) {
  return (
    <div className="text-center space-y-6">
      <LoadingSpinner variant="sparkles" size="lg" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="space-y-3"
      >
        <p className="text-xl font-semibold text-coffee-800">{text}</p>
        <p className="text-sm text-gray-600">
          Будь ласка, не закривайте цю сторінку
        </p>
      </motion.div>
    </div>
  )
}

export function FullScreenSpinner({ text = "Завантаження..." }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center space-y-6">
        <LoadingSpinner variant="default" size="lg" />
        {text && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-gray-700 font-medium"
          >
            {text}
          </motion.p>
        )}
      </div>
    </div>
  )
}
