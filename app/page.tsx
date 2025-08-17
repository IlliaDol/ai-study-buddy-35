'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Coffee, Heart, GraduationCap, DollarSign, Zap, Camera, Sparkles } from 'lucide-react'
import ImageUpload from '@/components/ImageUpload'
import IntentSelection from '@/components/IntentSelection'
import CoffeeReading from '@/components/CoffeeReading'
import ResultCard from '@/components/ResultCard'

type Intent = 'love' | 'money' | 'education' | 'luck' | null
type Step = 'welcome' | 'intent' | 'upload' | 'reading' | 'result'

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>('welcome')
  const [selectedIntent, setSelectedIntent] = useState<Intent>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [readingResult, setReadingResult] = useState<any>(null)

  const handleIntentSelect = (intent: Intent) => {
    setSelectedIntent(intent)
    setCurrentStep('upload')
  }

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl)
    setCurrentStep('reading')
    // Simulate AI processing
    setTimeout(() => {
      const result = generateMockReading(intent)
      setReadingResult(result)
      setCurrentStep('result')
    }, 3000)
  }

  const generateMockReading = (intent: Intent) => {
    const readings = {
      love: {
        symbol: 'Серце',
        message: 'Сьогодні твоє серце відкрите для нових знайомств. Не бійся показати свою справжню сутність.',
        ritual: 'Напиши 3 речі, за які ти вдячний сьогодні',
        color: 'pink'
      },
      money: {
        symbol: 'Ключ',
        message: 'Фінансові можливості чекають за кутом. Будь уважним до деталей та не пропусти свій шанс.',
        ritual: 'Поклади монету в гаманець і носи її весь день',
        color: 'green'
      },
      education: {
        symbol: 'Книга',
        message: 'Твоя мудрість зростає з кожним днем. Сьогодні особливо сприятливий час для навчання.',
        ritual: 'Прочитай 10 сторінок чогось нового',
        color: 'blue'
      },
      luck: {
        symbol: 'Зірка',
        message: 'Удача сьогодні на твоєму боці! Довіряй своїй інтуїції та сміливо йди вперед.',
        ritual: 'Зроби щось, що завжди хотів, але боявся',
        color: 'yellow'
      }
    }
    
    return readings[intent!] || readings.luck
  }

  const resetFlow = () => {
    setCurrentStep('welcome')
    setSelectedIntent(null)
    setUploadedImage(null)
    setReadingResult(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-coffee-100 to-cream-200">
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {currentStep === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center max-w-2xl mx-auto"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <Coffee className="w-24 h-24 mx-auto text-coffee-600 mb-4" />
                <h1 className="text-5xl font-bold text-mystic-800 mb-4 font-mystic">
                  Кавомант
                </h1>
                <p className="text-xl text-mystic-600 mb-8">
                  Пророцтва з кавової гущі
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="space-y-6"
              >
                <p className="text-lg text-mystic-700 leading-relaxed">
                  Завантаж фото кавової гущі та отримай персоналізоване пророцтво на день. 
                  AI проаналізує візерунки та розкаже, що чекає тебе попереду.
                </p>
                
                <div className="flex items-center justify-center space-x-4 text-sm text-mystic-500">
                  <div className="flex items-center space-x-2">
                    <Camera className="w-4 h-4" />
                    <span>Фото</span>
                  </div>
                  <div className="w-1 h-1 bg-mystic-300 rounded-full"></div>
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4" />
                    <span>AI аналіз</span>
                  </div>
                  <div className="w-1 h-1 bg-mystic-300 rounded-full"></div>
                  <div className="flex items-center space-x-2">
                    <Coffee className="w-4 h-4" />
                    <span>Пророцтво</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentStep('intent')}
                  className="bg-gradient-to-r from-coffee-500 to-coffee-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Почати ритуал
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {currentStep === 'intent' && (
            <IntentSelection onSelect={handleIntentSelect} />
          )}

          {currentStep === 'upload' && (
            <ImageUpload onUpload={handleImageUpload} intent={selectedIntent} />
          )}

          {currentStep === 'reading' && (
            <CoffeeReading image={uploadedImage} intent={selectedIntent} />
          )}

          {currentStep === 'result' && readingResult && (
            <ResultCard 
              result={readingResult} 
              image={uploadedImage}
              onReset={resetFlow}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
