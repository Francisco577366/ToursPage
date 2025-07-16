import Stripe from 'stripe'

let stripe

export function initStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error(
      'STRIPE_SECRET_KEY is not defined in environment variables.'
    )
  }

  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',
  })
}

export function getStripe() {
  if (!stripe) {
    throw new Error('Stripe has not been initialized. Call initStripe() first.')
  }

  return stripe
}
