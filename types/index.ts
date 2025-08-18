export type Intent = 'love' | 'money' | 'education' | 'luck' | 'health' | 'travel' | 'creativity' | 'spirituality' | 'family' | 'friendship' | null

export type Step = 'welcome' | 'intent' | 'upload' | 'reading' | 'result'

export interface ReadingResult {
  symbol: string
  message: string
  ritual: string
  color: string
  timestamp: Date
  intent: Intent
  imageUrl?: string
}

export interface User {
  id: string
  email?: string
  freeReadingsCount: number
  totalReadings: number
  subscription?: Subscription
  createdAt: Date
}

export interface Subscription {
  id: string
  planId: string
  status: 'active' | 'cancelled' | 'expired'
  startDate: Date
  endDate: Date
  plan: PaymentPlan
}

export interface PaymentPlan {
  id: string
  name: string
  price: number
  currency: string
  description: string
  features: string[]
  maxReadings?: number
  durationDays: number
}

export interface PaymentIntent {
  id: string
  planId: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed'
  createdAt: Date
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ReadingHistory {
  id: string
  result: ReadingResult
  createdAt: Date
  intent: Intent
}

export interface AppState {
  currentStep: Step
  selectedIntent: Intent
  uploadedImage: string | null
  readingResult: ReadingResult | null
  user: User | null
  isLoading: boolean
  error: string | null
}
