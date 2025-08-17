'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { Camera, Upload, Coffee, Sparkles, ArrowLeft } from 'lucide-react'

type Intent = 'love' | 'money' | 'education' | 'luck' | null

interface ImageUploadProps {
  onUpload: (imageUrl: string) => void
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto text-center"
      >
        <div className="mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-coffee-400 to-coffee-600 rounded-full flex items-center justify-center"
          >
            <Sparkles className="w-12 h-12 text-white" />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-mystic-800 mb-4 font-mystic">
            AI читає твою каву...
          </h2>
          
          <p className="text-lg text-mystic-600 mb-6">
            Аналізую візерунки та шукаю символи в гущі
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-3 text-sm text-mystic-500">
            <div className="w-2 h-2 bg-coffee-400 rounded-full animate-pulse"></div>
            <span>Знаходжу контури та форми</span>
          </div>
          
          <div className="flex items-center justify-center space-x-3 text-sm text-mystic-500">
            <div className="w-2 h-2 bg-coffee-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <span>Визначаю архетипи та символи</span>
          </div>
          
          <div className="flex items-center justify-center space-x-3 text-sm text-mystic-500">
            <div className="w-2 h-2 bg-coffee-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            <span>Генерую персоналізоване пророцтво</span>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="mb-6"
        >
          <div className={`
            w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${intentColors[intent!]}
            flex items-center justify-center text-3xl
          `}>
            {intentEmojis[intent!]}
          </div>
          
          <h2 className="text-3xl font-bold text-mystic-800 mb-3 font-mystic">
            Завантаж фото кавової гущі
          </h2>
          
          <p className="text-lg text-mystic-600">
            AI проаналізує візерунки та знайде символи для твого наміру
          </p>
        </motion.div>
      </div>

      <div className="space-y-6">
        {/* Upload Area */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300
            ${isDragActive 
              ? 'border-coffee-400 bg-coffee-50' 
              : 'border-mystic-300 hover:border-coffee-400 hover:bg-coffee-50'
            }
          `}
        >
          <input {...getInputProps()} />
          
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-coffee-400 to-coffee-600 rounded-full flex items-center justify-center">
              {isDragActive ? <Upload className="w-8 h-8 text-white" /> : <Camera className="w-8 h-8 text-white" />}
            </div>
            
            <div>
              <p className="text-xl font-semibold text-mystic-700 mb-2">
                {isDragActive ? 'Відпустіть файл тут' : 'Перетягніть фото або клікніть для вибору'}
              </p>
              <p className="text-mystic-500">
                Підтримуються: JPG, PNG, WebP (до 10MB)
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tips */}
        <div className="bg-cream-100 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-mystic-800 mb-4 flex items-center">
            <Coffee className="w-5 h-5 mr-2 text-coffee-600" />
            Поради для кращого результату
          </h3>
          
          <ul className="space-y-2 text-sm text-mystic-600">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-coffee-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Зробіть фото зверху, щоб гуща була чітко видна
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-coffee-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Добре освітлення допоможе AI краще розгледіти деталі
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-coffee-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Переконайтеся, що гуща розподілена по всьому дну чашки
            </li>
          </ul>
        </div>

        {/* Disclaimer */}
        <div className="text-center text-xs text-mystic-400">
          <p>⚠️ Це розвага, не медичні або фінансові поради</p>
        </div>
      </div>
    </motion.div>
  )
}
