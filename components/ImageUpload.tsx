'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Camera, Sparkles, Coffee, AlertCircle, CheckCircle } from 'lucide-react'
import { ReadingService } from '@/services/readingService'
import { Intent } from '@/types'

interface ImageUploadProps {
  onUpload: (imageUrl: string) => void
  intent: Intent
  canProceed: boolean
}

export default function ImageUpload({ onUpload, intent, canProceed }: ImageUploadProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const intentTitle = useMemo(() => ReadingService.getIntentTitle(intent), [intent])
  const intentDescription = useMemo(() => ReadingService.getIntentDescription(intent), [intent])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    setError(null)
    setIsProcessing(true)
    setUploadProgress(0)

    try {
      // Validate image
      const validation = ReadingService.validateImage(file)
      if (!validation.isValid) {
        throw new Error(validation.error)
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 100)

      // Convert to base64 (in real app, this would be uploaded to a server)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setUploadedImage(result)
        setUploadProgress(100)
        
        setTimeout(() => {
          setIsProcessing(false)
          onUpload(result)
        }, 500)
      }
      
      reader.readAsDataURL(file)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка завантаження зображення')
      setIsProcessing(false)
      setUploadProgress(0)
    }
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    disabled: isProcessing || !canProceed
  })

  const removeImage = useCallback(() => {
    setUploadedImage(null)
    setError(null)
    setUploadProgress(0)
  }, [])

  const getDropzoneClasses = useMemo(() => {
    let baseClasses = "border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer"
    
    if (isDragActive && !isDragReject) {
      baseClasses += " border-coffee-500 bg-coffee-50/50 scale-105"
    } else if (isDragReject) {
      baseClasses += " border-red-500 bg-red-50/50"
    } else if (uploadedImage) {
      baseClasses += " border-green-500 bg-green-50/50"
    } else {
      baseClasses += " border-coffee-300 hover:border-coffee-400 hover:bg-coffee-50/30"
    }

    if (!canProceed) {
      baseClasses += " opacity-50 cursor-not-allowed"
    }

    return baseClasses
  }, [isDragActive, isDragReject, uploadedImage, canProceed])

  if (!canProceed) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto text-center"
      >
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-200">
          <div className="w-20 h-20 mx-auto mb-6 bg-amber-100 rounded-full flex items-center justify-center">
            <Coffee className="w-10 h-10 text-amber-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-amber-800 mb-4">
            Безкоштвні пророцтва закінчилися
          </h2>
          
          <p className="text-amber-700 mb-6 leading-relaxed">
            Ви використали всі {4 - freeReadingsLeft} безкоштвних пророцтв. 
            Оберіть план підписки для продовження отримання персоналізованих пророцтв.
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Оберіть план підписки
          </motion.button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-coffee-500 to-coffee-600 rounded-full flex items-center justify-center"
        >
          <Camera className="w-8 h-8 text-white" />
        </motion.div>
        
        <h2 className="text-3xl font-bold text-coffee-800 mb-3">
          Завантажте фото кофейної гущі
        </h2>
        
        <p className="text-coffee-600 text-lg mb-2">
          {intentTitle} - {intentDescription}
        </p>
        
        <p className="text-gray-600">
          Залишилося безкоштвних пророцтв: <span className="font-semibold text-coffee-600">{freeReadingsLeft}</span>
        </p>
      </div>

      {/* Upload Area */}
      <div className="space-y-6">
        <div
          {...getRootProps()}
          className={getDropzoneClasses}
        >
          <input {...getInputProps()} />
          
          <AnimatePresence mode="wait">
            {!uploadedImage && !isProcessing && (
              <motion.div
                key="upload-prompt"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-4"
              >
                <div className="w-20 h-20 mx-auto bg-coffee-100 rounded-full flex items-center justify-center">
                  <Upload className="w-10 h-10 text-coffee-600" />
                </div>
                
                <div>
                  <p className="text-xl font-semibold text-coffee-800 mb-2">
                    {isDragActive ? 'Відпустіть файл тут' : 'Перетягніть фото сюди або клікніть для вибору'}
                  </p>
                  <p className="text-coffee-600">
                    Підтримуються JPEG, PNG та WebP формати (макс. 10MB)
                  </p>
                </div>
              </motion.div>
            )}

            {isProcessing && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-4"
              >
                <div className="w-20 h-20 mx-auto bg-coffee-100 rounded-full flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 border-4 border-coffee-200 border-t-coffee-600 rounded-full"
                  />
                </div>
                
                <div>
                  <p className="text-xl font-semibold text-coffee-800 mb-2">
                    Обробляю зображення...
                  </p>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-coffee-200 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-coffee-500 to-coffee-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className="text-sm text-coffee-600 mt-2">{uploadProgress}%</p>
                </div>
              </motion.div>
            )}

            {uploadedImage && !isProcessing && (
              <motion.div
                key="uploaded"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-4"
              >
                <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                
                <div>
                  <p className="text-xl font-semibold text-green-800 mb-2">
                    Зображення успішно завантажено!
                  </p>
                  <p className="text-green-600">
                    Готуюся до аналізу кофейної гущі...
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </motion.div>
        )}

        {/* Instructions */}
        <div className="bg-gradient-to-r from-coffee-50 to-cream-50 rounded-2xl p-6 border border-coffee-200">
          <h3 className="text-lg font-semibold text-coffee-800 mb-4 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-coffee-600" />
            Як зробити ідеальне фото
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-coffee-700">
            <div className="space-y-2">
              <p>✅ Використовуйте природне освітлення</p>
              <p>✅ Фотографуйте зверху вниз</p>
              <p>✅ Переконайтеся, що гуща чітко видна</p>
            </div>
            <div className="space-y-2">
              <p>✅ Уникайте тіней та відблисків</p>
              <p>✅ Зробіть кілька фото для кращого результату</p>
              <p>✅ Перевірте якість перед завантаженням</p>
            </div>
          </div>
        </div>

        {/* Remove Button */}
        {uploadedImage && !isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <button
              onClick={removeImage}
              className="inline-flex items-center space-x-2 text-coffee-600 hover:text-coffee-700 font-medium"
            >
              <X className="w-4 h-4" />
              <span>Вибрати інше зображення</span>
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
