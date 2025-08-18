import { PaymentPlan, PaymentIntent, ApiResponse } from '@/types'

export class PaymentService {
  private static readonly API_BASE = '/api'

  static async createPayment(planId: string, intent: string, intentTitle: string): Promise<PaymentIntent> {
    try {
      const response = await fetch(`${this.API_BASE}/create-nowpayment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          plan: planId, 
          intent,
          intentTitle 
        })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Payment creation failed')
      }
      
      return result.data
    } catch (error) {
      console.error('Payment creation error:', error)
      throw new Error('Failed to create payment. Please try again.')
    }
  }

  static async verifyPayment(paymentId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/payment-webhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId })
      })
      
      if (!response.ok) {
        return false
      }
      
      const result = await response.json()
      return result.success && result.data?.status === 'completed'
    } catch (error) {
      console.error('Payment verification error:', error)
      return false
    }
  }

  static async getPaymentPlans(): Promise<PaymentPlan[]> {
    // In a real app, this would fetch from an API
    return [
      {
        id: 'single',
        name: 'Одноразове пророцтво',
        price: 0.99,
        currency: 'USD',
        description: 'Отримайте детальне пророцтво для вашого намерения',
        features: [
          'Детальне AI пророцтво',
          'Астрологічні деталі',
          'Персональні поради',
          'Доступ 24 години'
        ],
        maxReadings: 1,
        durationDays: 1
      },
      {
        id: 'package5',
        name: 'Пакет 5 пророцтв',
        price: 3.99,
        currency: 'USD',
        description: 'Економічний пакет для регулярних запитів',
        features: [
          '5 детальних пророцтв',
          'Збереження історії',
          'Порівняння результатів',
          'Доступ 30 днів'
        ],
        maxReadings: 5,
        durationDays: 30
      },
      {
        id: 'premium',
        name: 'Premium місяць',
        price: 9.99,
        currency: 'USD',
        description: 'Необмежена кількість пророцтв та розширені можливості',
        features: [
          'Необмежена кількість пророцтв',
          'Детальна аналітика',
          'Експертні поради',
          'Пріоритетна підтримка',
          'Доступ 30 днів'
        ],
        maxReadings: -1, // Unlimited
        durationDays: 30
      },
      {
        id: 'vip',
        name: 'VIP місяць',
        price: 19.99,
        currency: 'USD',
        description: 'Повний доступ до всіх функцій та ексклюзивний контент',
        features: [
          'Все з Premium',
          'Ексклюзивні ритуали',
          'Персональний астролог',
          'Групові сесії',
          'Доступ 30 днів'
        ],
        maxReadings: -1, // Unlimited
        durationDays: 30
      }
    ]
  }

  static async getSubscriptionStatus(userId: string): Promise<ApiResponse<any>> {
    try {
      // In a real app, this would fetch from an API
      const response = await fetch(`${this.API_BASE}/subscription-status?userId=${userId}`)
      
      if (!response.ok) {
        return { success: false, error: 'Failed to fetch subscription status' }
      }
      
      return await response.json()
    } catch (error) {
      console.error('Subscription status error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  static async cancelSubscription(subscriptionId: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await fetch(`${this.API_BASE}/cancel-subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId })
      })
      
      if (!response.ok) {
        return { success: false, error: 'Failed to cancel subscription' }
      }
      
      return await response.json()
    } catch (error) {
      console.error('Cancel subscription error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  static formatPrice(price: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(price)
  }

  static calculateSavings(originalPrice: number, discountedPrice: number): number {
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
  }

  static isPopularPlan(planId: string): boolean {
    return planId === 'package5' // Package 5 is marked as popular
  }

  static getPlanBenefits(planId: string): string[] {
    const benefits: Record<string, string[]> = {
      single: ['Quick access', 'One-time payment', 'No commitment'],
      package5: ['Best value', 'Save 20%', 'Flexible usage'],
      premium: ['Unlimited access', 'Premium features', 'Priority support'],
      vip: ['Exclusive content', 'Personal guidance', 'Community access']
    }
    
    return benefits[planId] || []
  }
}
