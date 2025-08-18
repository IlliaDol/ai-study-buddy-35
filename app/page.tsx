'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Coffee, Heart, GraduationCap, DollarSign, Zap, Camera, Sparkles, Star, Moon } from 'lucide-react'
import ImageUpload from '@/components/ImageUpload'
import IntentSelection from '@/components/IntentSelection'
import CoffeeReading from '@/components/CoffeeReading'
import ResultCard from '@/components/ResultCard'
import Footer from '@/components/Footer'

type Intent = 'love' | 'money' | 'education' | 'luck' | null
type Step = 'welcome' | 'intent' | 'upload' | 'reading' | 'result'

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>('welcome')
  const [selectedIntent, setSelectedIntent] = useState<Intent>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [readingResult, setReadingResult] = useState<any>(null)
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([])

  useEffect(() => {
    // Create particles for animation
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }))
    setParticles(newParticles)
  }, [])

  const handleIntentSelect = (intent: Intent) => {
    setSelectedIntent(intent)
    setCurrentStep('upload')
  }

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl)
    setCurrentStep('reading')
    // Simulate AI processing
    setTimeout(() => {
      const result = generateMockReading(selectedIntent)
      setReadingResult(result)
      setCurrentStep('result')
    }, 3000)
  }

  const generateMockReading = (intent: Intent) => {
    const readings = {
      love: {
        symbol: 'Heart',
        message: 'Today your heart is open to new connections. Don\'t be afraid to show your true essence.',
        ritual: 'Write down 3 things you are grateful for today',
        color: 'pink'
      },
      money: {
        symbol: 'Key',
        message: 'Financial opportunities are waiting around the corner. Pay attention to details and don\'t miss your chance.',
        ritual: 'Place a coin in your wallet and carry it all day',
        color: 'green'
      },
      education: {
        symbol: 'Book',
        message: 'Your wisdom grows with each day. Today is especially favorable for learning.',
        ritual: 'Read 10 pages of something new',
        color: 'blue'
      },
      luck: {
        symbol: 'Star',
        message: 'Luck is on your side today! Trust your intuition and move forward boldly.',
        ritual: 'Do something you always wanted but were afraid of',
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
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-coffee-100 to-cream-200 relative overflow-hidden">
      {/* Animated particles */}
      {currentStep === 'welcome' && particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 bg-coffee-300/30 rounded-full pointer-events-none"
          style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 4,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Background gradient with animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-coffee-50/50 via-transparent to-cream-100/50 animate-pulse"></div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <AnimatePresence mode="wait">
          {currentStep === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center max-w-4xl mx-auto"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                className="mb-12"
              >
                {/* Main icon with effects */}
                <div className="relative mb-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 w-32 h-32 mx-auto border-2 border-coffee-200 rounded-full opacity-30"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 w-24 h-24 mx-auto border border-coffee-300 rounded-full opacity-50"
                  />
                  <div className="relative z-10">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-24 h-24 mx-auto bg-gradient-to-br from-coffee-500 to-coffee-600 rounded-full flex items-center justify-center shadow-2xl shadow-coffee-500/30"
                    >
                      <Coffee className="w-12 h-12 text-white" />
                    </motion.div>
                  </div>
                </div>

                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-6xl font-bold text-mystic-800 mb-6 font-mystic bg-gradient-to-r from-coffee-600 to-mystic-800 bg-clip-text text-transparent"
                >
                  CoffeeOracle
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-2xl text-mystic-600 mb-8 font-medium"
                >
                  Coffee Ground Divination
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
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
                className="space-y-8"
              >
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="text-xl text-mystic-700 leading-relaxed max-w-3xl mx-auto"
                >
                  Upload a photo of your coffee grounds and receive a personalized prophecy for the day. 
                  AI will analyze the patterns and tell you what awaits you ahead.
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 }}
                  className="flex items-center justify-center space-x-6 text-sm text-mystic-500"
                >
                  <div className="flex items-center space-x-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full">
                    <Camera className="w-5 h-5 text-coffee-500" />
                    <span className="font-medium">Photo</span>
                  </div>
                  <div className="w-2 h-2 bg-coffee-300 rounded-full animate-pulse"></div>
                  <div className="flex items-center space-x-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full">
                    <Sparkles className="w-5 h-5 text-coffee-500" />
                    <span className="font-medium">AI Analysis</span>
                  </div>
                  <div className="w-2 h-2 bg-coffee-300 rounded-full animate-pulse"></div>
                  <div className="flex items-center space-x-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full">
                    <Coffee className="w-5 h-5 text-coffee-500" />
                    <span className="font-medium">Prophecy</span>
                  </div>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.6, type: "spring", stiffness: 100 }}
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 20px 40px rgba(242, 117, 42, 0.3)",
                    y: -2
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentStep('intent')}
                  className="bg-gradient-to-r from-coffee-500 via-coffee-600 to-coffee-700 text-white px-12 py-5 rounded-full text-xl font-semibold shadow-2xl shadow-coffee-500/30 transition-all duration-300 relative overflow-hidden group"
                >
                  <span className="relative z-10">Start Ritual</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-coffee-600 to-coffee-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                  />
                </motion.button>

                {/* Additional information */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.0 }}
                  className="mt-12 p-6 bg-white/30 backdrop-blur-sm rounded-2xl border border-white/50"
                >
                  <p className="text-mystic-600 text-sm text-center">
                    ✨ Each prophecy is unique and created specifically for you
                  </p>
                </motion.div>
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
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
