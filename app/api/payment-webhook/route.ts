import { NextResponse } from 'next/server'
import crypto from 'crypto'

// NOWPayments IPN secret key (you need to get this from your NOWPayments dashboard)
const IPN_SECRET = process.env.NOWPAYMENTS_IPN_SECRET || 'your_ipn_secret_here'

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-nowpayments-sig')
    
    if (!signature) {
      console.error('No signature provided')
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    // Verify signature
    const sortedBody = JSON.stringify(JSON.parse(body), Object.keys(JSON.parse(body)).sort())
    const hmac = crypto.createHmac('sha512', IPN_SECRET)
    hmac.update(sortedBody)
    const calculatedSignature = hmac.digest('hex')

    if (signature !== calculatedSignature) {
      console.error('Invalid signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const paymentData = JSON.parse(body)
    console.log('Payment webhook received:', paymentData)

    // Handle different payment statuses
    switch (paymentData.payment_status) {
      case 'finished':
        console.log(`Payment ${paymentData.payment_id} completed successfully`)
        // Here you can add logic to unlock user access, send confirmation emails, etc.
        break
        
      case 'partially_paid':
        console.log(`Payment ${paymentData.payment_id} partially paid`)
        break
        
      case 'failed':
        console.log(`Payment ${paymentData.payment_id} failed`)
        break
        
      case 'expired':
        console.log(`Payment ${paymentData.payment_id} expired`)
        break
        
      default:
        console.log(`Payment ${paymentData.payment_id} status: ${paymentData.payment_status}`)
    }

    return NextResponse.json({ status: 'ok' })

  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
