'use client'

import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle, Loader, TestTube } from 'lucide-react'
import { useState } from 'react'

export default function PaymentTest() {
  const [testResult, setTestResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [testData, setTestData] = useState({
    plan: 'single',
    intent: 'test_intent',
    intentTitle: 'Тестове намерение'
  })

  const runTest = async () => {
    setLoading(true)
    setTestResult(null)

    try {
      const response = await fetch('/api/create-nowpayment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      })

      const data = await response.json()

      if (response.ok) {
        setTestResult(`✅ Тест успішний! Payment ID: ${data.id}`)
      } else {
        setTestResult(`❌ Помилка: ${data.error}`)
      }
    } catch (error: any) {
      setTestResult(`❌ Помилка з'єднання: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-200"
    >
      <div className="flex items-center space-x-3 mb-6">
        <TestTube className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Тест платежної системи
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            План
          </label>
          <select
            value={testData.plan}
            onChange={(e) => setTestData({ ...testData, plan: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="single">Single ($0.99)</option>
            <option value="package5">Package 5 ($3.99)</option>
            <option value="premium">Premium ($9.99)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Intent ID
          </label>
          <input
            type="text"
            value={testData.intent}
            onChange={(e) => setTestData({ ...testData, intent: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="test_intent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Intent Title
          </label>
          <input
            type="text"
            value={testData.intentTitle}
            onChange={(e) => setTestData({ ...testData, intentTitle: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Тестове намерение"
          />
        </div>

        <button
          onClick={runTest}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              <span>Тестування...</span>
            </>
          ) : (
            <>
              <TestTube className="w-4 h-4" />
              <span>Запустити тест</span>
            </>
          )}
        </button>

        {testResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-3 rounded-lg ${
              testResult.includes('✅')
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            <div className="flex items-start space-x-2">
              {testResult.includes('✅') ? (
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              )}
              <p className={`text-sm ${
                testResult.includes('✅') ? 'text-green-800' : 'text-red-800'
              }`}>
                {testResult}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">💡 Поради:</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Перевірте, чи створений файл .env.local</li>
          <li>• Переконайтеся, що API ключ правильний</li>
          <li>• Перевірте консоль браузера на помилки</li>
          <li>• Перезапустіть сервер після зміни змінних</li>
        </ul>
      </div>
    </motion.div>
  )
}
