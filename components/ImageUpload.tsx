'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { Camera, Upload, Coffee, Sparkles, ArrowLeft, CheckCircle, Lightbulb, Zap } from 'lucide-react'

import { Intent } from '@/types'

interface ImageUploadProps {
  onUpload: (imageUrl: string) => void
  intent: Intent | null
}

const intentEmojis = {
  love: '❤️',
  money: '💰',
  education: '📚',
  luck: '✨',
  health: '🏥',
  travel: '✈️',
  creativity: '🎨',
  spirituality: '🙏',
  family: '👨‍👩‍👧‍👦',
  friendship: '🤝'
}

const intentColors = {
  love: 'from-pink-400 to-rose-500',
  money: 'from-emerald-400 to-green-500',
  education: 'from-blue-400 to-indigo-500',
  luck: 'from-amber-400 to-yellow-500',
  health: 'from-green-400 to-emerald-500',
  travel: 'from-blue-400 to-cyan-500',
  creativity: 'from-purple-400 to-pink-500',
  spirituality: 'from-indigo-400 to-purple-500',
  family: 'from-orange-400 to-red-500',
  friendship: 'from-teal-400 to-blue-500'
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

export default function ImageUpload({ onUpload, intent }: ImageUploadProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setUploadedImage(result)
        setIsProcessing(true)
        
        // Simulate image processing
        setTimeout(() => {
          setIsProcessing(false)
          onUpload(result)
        }, 2000)
      }
      reader.readAsDataURL(file)
    }
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024 // 10MB
  })

  if (uploadedImage && isProcessing) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl mx-auto text-center"
      >
        {/* Header with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-coffee-400 to-coffee-600 rounded-full flex items-center justify-center shadow-2xl shadow-coffee-500/30 relative"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 border-4 border-coffee-200 rounded-full opacity-30"
            />
            <Sparkles className="w-16 h-16 text-white" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-bold text-mystic-800 mb-6 font-mystic bg-gradient-to-r from-coffee-600 to-mystic-800 bg-clip-text text-transparent"
          >
            AI is reading your coffee...
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-mystic-600 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Analyzing patterns and searching for symbols in the grounds for your intent: <span className="font-semibold text-coffee-600">{intentNames[intent!]}</span>
          </motion.p>
        </motion.div>

        {/* Analysis progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-6 max-w-2xl mx-auto"
        >
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
              className="flex items-center space-x-4 text-lg text-mystic-600 bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-white/50"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-3 h-3 bg-coffee-400 rounded-full"
              />
              <span className="font-medium">Finding contours and shapes in the grounds</span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
              className="flex items-center space-x-4 text-lg text-mystic-600 bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-white/50"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="w-3 h-3 bg-coffee-400 rounded-full"
              />
              <span className="font-medium">Determining archetypes and symbols</span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
              className="flex items-center space-x-4 text-lg text-mystic-600 bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-white/50"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 1.0 }}
                className="w-3 h-3 bg-coffee-400 rounded-full"
              />
              <span className="font-medium">Generating personalized prophecy</span>
            </motion.div>
          </div>

          {/* Additional information */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="mt-8 p-6 bg-gradient-to-r from-coffee-50 to-cream-50 rounded-2xl border border-coffee-200"
          >
            <p className="text-coffee-700 text-sm text-center">
              ✨ AI analyzes every pattern considering your intent and creates a unique prophecy
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
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
              w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br ${intentColors[intent!]}
              flex items-center justify-center text-4xl shadow-2xl shadow-black/20
            `}
          >
            {intentEmojis[intent!]}
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-mystic-800 mb-4 font-mystic bg-gradient-to-r from-coffee-600 to-mystic-800 bg-clip-text text-transparent"
          >
            Upload Coffee Grounds Photo
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-mystic-600 max-w-2xl mx-auto leading-relaxed"
          >
            AI will analyze the patterns and find symbols for your intent: <span className="font-semibold text-coffee-600">{intentNames[intent!]}</span>
          </motion.p>
        </motion.div>
      </div>

      <div className="space-y-8">
        {/* Upload Area */}
        <div {...getRootProps()}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              border-2 border-dashed rounded-3xl p-16 text-center cursor-pointer transition-all duration-500
              ${isDragActive 
                ? 'border-coffee-400 bg-gradient-to-br from-coffee-50 to-cream-50 shadow-2xl shadow-coffee-500/20' 
                : 'border-mystic-300 hover:border-coffee-400 hover:bg-gradient-to-br hover:from-coffee-50 hover:to-cream-50 hover:shadow-xl hover:shadow-coffee-500/10'
              }
              relative overflow-hidden group
            `}
          >
            <input {...getInputProps()} />
            
            {/* Background effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-coffee-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 space-y-6">
              <motion.div 
                className="w-20 h-20 mx-auto bg-gradient-to-br from-coffee-400 to-coffee-600 rounded-full flex items-center justify-center shadow-2xl shadow-coffee-500/30"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                {isDragActive ? <Upload className="w-10 h-10 text-white" /> : <Camera className="w-10 h-10 text-white" />}
              </motion.div>
              
              <div>
                <motion.p 
                  className="text-2xl font-semibold text-mystic-700 mb-3"
                  whileHover={{ scale: 1.05 }}
                >
                  {isDragActive ? 'Drop file here' : 'Drag and drop photo or click to select'}
                </motion.p>
                <p className="text-mystic-500 text-lg">
                  Supported: JPG, PNG, WebP (up to 10MB)
                </p>
              </div>

              {/* Drag indicator */}
              {isDragActive && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center space-x-2 text-coffee-600 font-medium"
                >
                  <Zap className="w-5 h-5 animate-pulse" />
                  <span>Ready to upload!</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-br from-cream-100 to-coffee-50 rounded-2xl p-8 border border-coffee-200 shadow-lg"
        >
          <motion.h3 
            className="text-xl font-semibold text-mystic-800 mb-6 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
          >
            <Lightbulb className="w-6 h-6 mr-3 text-coffee-600" />
            Tips for Better Results
          </motion.h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              className="text-center p-4 bg-white/50 rounded-xl border border-white/50"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-coffee-400 to-coffee-600 rounded-full flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-mystic-800 mb-2">Shooting Angle</h4>
              <p className="text-sm text-mystic-600">Take photo from above so grounds are clearly visible</p>
            </motion.div>

            <motion.div 
              className="text-center p-4 bg-white/50 rounded-xl border border-white/50"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-coffee-400 to-coffee-600 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-mystic-800 mb-2">Lighting</h4>
              <p className="text-sm text-mystic-600">Good lighting helps AI see details better</p>
            </motion.div>

            <motion.div 
              className="text-center p-4 bg-white/50 rounded-xl border border-white/50"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-coffee-400 to-coffee-600 rounded-full flex items-center justify-center">
                <Coffee className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-mystic-800 mb-2">Grounds Distribution</h4>
              <p className="text-sm text-mystic-600">Make sure grounds are spread across the entire cup bottom</p>
            </motion.div>
          </div>
        </motion.div>


      </div>
    </motion.div>
  )
}
