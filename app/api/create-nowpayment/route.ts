import { NextResponse } from 'next/server'

// NOWPayments API configuration - use environment variables
const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY || '78WRCRN-GV3M3RB-HD1CHR9-HVXS5RZ'
const NOWPAYMENTS_BASE_URL = process.env.NOWPAYMENTS_BASE_URL || 'https://api.nowpayments.io/v1'

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
  premium: {
    name: 'Premium місяць',
    price: 9.99,
    description: 'Необмежена кількість пророцтв та розширені можливості'
  }
}

export async function POST(request: Request) {
  try {
    const { plan, intent, intentTitle } = await request.json()

    // Validation
    if (!plan || !intent || !intentTitle) {
      return NextResponse.json(
        { error: 'Відсутні обов\'язкові поля: plan, intent, intentTitle' },
        { status: 400 }
      )
    }

    const planConfig = planConfigs[plan as keyof typeof planConfigs]
    if (!planConfig) {
      return NextResponse.json(
        { error: `Невірний план: ${plan}. Доступні плани: ${Object.keys(planConfigs).join(', ')}` },
        { status: 400 }
      )
    }

    // Validate API key
    if (!NOWPAYMENTS_API_KEY || NOWPAYMENTS_API_KEY === 'your-api-key-here') {
      return NextResponse.json(
        { error: 'NOWPayments API ключ не налаштований' },
        { status: 500 }
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

    console.log('Creating NOWPayments payment with data:', {
      ...paymentData,
      api_key: NOWPAYMENTS_API_KEY ? '***' : 'NOT_SET'
    })

    const response = await fetch(`${NOWPAYMENTS_BASE_URL}/invoice`, {
      method: 'POST',
      headers: {
        'x-api-key': NOWPAYMENTS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('NOWPayments API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      })

      // Provide more specific error messages
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Невірний API ключ NOWPayments. Перевірте налаштування.' },
          { status: 401 }
        )
      } else if (response.status === 429) {
        return NextResponse.json(
          { error: 'Перевищено ліміт запитів до NOWPayments. Спробуйте пізніше.' },
          { status: 429 }
        )
      } else {
        return NextResponse.json(
          { error: `Помилка NOWPayments API: ${response.status} ${response.statusText}` },
          { status: response.status }
        )
      }
    }

    const payment = await response.json()
    console.log('Payment created successfully:', payment)

    return NextResponse.json({
      id: payment.id,
      invoice_url: payment.invoice_url,
      payment_id: payment.id,
      status: 'created',
      widget_url: `https://nowpayments.io/embeds/payment-widget?iid=${payment.id}`,
      plan: planConfig.name,
      price: planConfig.price
    })

  } catch (error) {
    console.error('Payment creation error:', error)

    // Provide user-friendly error messages
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        return NextResponse.json(
          { error: 'Помилка з\'єднання з сервером оплати. Перевірте інтернет-з\'єднання.' },
          { status: 500 }
        )
      }
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Невідома помилка при створенні оплати' },
      { status: 500 }
    )
  }
}
