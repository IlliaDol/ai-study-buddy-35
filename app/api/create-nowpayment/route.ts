import { NextResponse } from 'next/server'

// NOWPayments API configuration
const NOWPAYMENTS_API_KEY = '78WRCRN-GV3M3RB-HD1CHR9-HVXS5RZ'
const NOWPAYMENTS_BASE_URL = 'https://api.nowpayments.io/v1'

// Plan configurations with prices in USD
const planConfigs = {
  single: {
    name: 'Одноразове пророцтво',
    price: 0.99,
    description: 'Детальне AI пророцтво з астрологічними деталями'
  },
  package5: {
    name: 'Пакет 5 пророцтв',
    price: 3.99,
    description: '5 детальних пророцтв з збереженням історії'
  },
  package10: {
    name: 'Пакет 10 пророцтв',
    price: 6.99,
    description: '10 детальних пророцтв з розширеними можливостями'
  },
  package20: {
    name: 'Пакет 20 пророцтв',
    price: 11.99,
    description: '20 детальних пророцтв з ексклюзивним контентом'
  },
  premium: {
    name: 'Premium місяць',
    price: 9.99,
    description: 'Необмежена кількість пророцтв та розширені можливості'
  },
  vip: {
    name: 'VIP місяць',
    price: 19.99,
    description: 'Повний доступ до всіх функцій та ексклюзивний контент'
  }
}

export async function POST(request: Request) {
  try {
    const { plan, intent, intentTitle } = await request.json()

    // Validation
    if (!plan || !intent || !intentTitle) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const planConfig = planConfigs[plan as keyof typeof planConfigs]
    if (!planConfig) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      )
    }

    // Create NOWPayments payment
    const paymentData = {
      price_amount: planConfig.price,
      price_currency: 'usd',
      pay_currency: null, // Let user choose crypto currency
      order_id: `${intent}_${plan}_${Date.now()}`,
      order_description: `CoffeeOracle ${planConfig.name} для намерения "${intentTitle}"`,
      ipn_callback_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/payment-webhook`,
      success_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/success?session_id={payment_id}&intent=${intent}&plan=${plan}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/cancel?intent=${intent}`,
      partially_paid_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/cancel?intent=${intent}`,
      is_fixed_rate: false,
      is_fee_paid_by_user: false
    }

    const response = await fetch(`${NOWPAYMENTS_BASE_URL}/invoice`, {
      method: 'POST',
      headers: {
        'x-api-key': NOWPAYMENTS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('NOWPayments API error:', errorData)
      throw new Error(`NOWPayments API error: ${response.status}`)
    }

    const payment = await response.json()

    return NextResponse.json({
      id: payment.id,
      invoice_url: payment.invoice_url,
      payment_id: payment.id,
      status: 'created',
      widget_url: `https://nowpayments.io/embeds/payment-widget?iid=${payment.id}`
    })

  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}
