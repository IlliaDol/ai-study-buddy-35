import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// Ініціалізація Stripe (в продакшені використовуйте реальні ключі)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_...', {
  apiVersion: '2025-07-30.basil',
})

// Конфігурація планів
const planConfigs = {
  single: {
    name: 'Одноразове пророцтво',
    price: 99, // $0.99 в центах
    description: 'Детальне AI пророцтво з астрологічними деталями'
  },
  package5: {
    name: 'Пакет 5 пророцтв',
    price: 399, // $3.99 в центах
    description: '5 детальних пророцтв з збереженням історії'
  },
  package10: {
    name: 'Пакет 10 пророцтв',
    price: 699, // $6.99 в центах
    description: '10 детальних пророцтв з розширеними можливостями'
  },
  package20: {
    name: 'Пакет 20 пророцтв',
    price: 1199, // $11.99 в центах
    description: '20 детальних пророцтв з ексклюзивним контентом'
  },
  premium: {
    name: 'Premium місяць',
    price: 999, // $9.99 в центах
    description: 'Необмежена кількість пророцтв та розширені можливості'
  },
  vip: {
    name: 'VIP місяць',
    price: 1999, // $19.99 в центах
    description: 'Повний доступ до всіх функцій та ексклюзивний контент'
  }
}

export async function POST(request: Request) {
  try {
    const { plan, intent, intentTitle } = await request.json()

    // Валідація вхідних даних
    if (!plan || !intent || !intentTitle) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Перевірка, чи існує план
    const planConfig = planConfigs[plan as keyof typeof planConfigs]
    if (!planConfig) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      )
    }

    // Створення Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `CoffeeOracle ${planConfig.name}`,
              description: `${planConfig.description} для намерения "${intentTitle}"`,
              images: [`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/icon.svg`],
              metadata: {
                intent: intent,
                intentTitle: intentTitle,
                plan: plan
              }
            },
            unit_amount: planConfig.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}&intent=${intent}&plan=${plan}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/cancel?intent=${intent}`,
      metadata: {
        intent: intent,
        intentTitle: intentTitle,
        plan: plan,
        userId: 'anonymous' // В майбутньому тут буде реальний ID користувача
      },
      customer_email: 'customer@example.com', // В майбутньому буде з форми
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'DE', 'FR', 'IT', 'ES', 'UA'], // Додайте Україну
      },
      payment_intent_data: {
        metadata: {
          intent: intent,
          intentTitle: intentTitle,
          plan: plan
        }
      }
    })

    return NextResponse.json({ 
      id: session.id,
      url: session.url 
    })

  } catch (error) {
    console.error('Stripe error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
