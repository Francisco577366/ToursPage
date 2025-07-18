/* eslint-disable */
import axios from 'axios'
import { showAlert } from './alert'

const stripe = Stripe(
  'pk_test_51RkEvHFQ8Q5gh1sLxqaPHPwrAGM4KmZYtPbd32JFJ8IX7Hw65ctNaFB0AZB9D92RtBbSXykB4yFELa0MQ8fyLewH00SrJjRSJs'
)

export const bookTour = async tourID => {
  try {
    // 1) Get checkout session from api
    const session = await axios(
      process.env.NODE_ENV === 'development'
        ? `https://tourspage-production.up.railway.app/api/v1/bookings/checkout-session/${tourID}`
        : `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourID}`
    )
    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    })
  } catch {
    showAlert('error', err)
  }
}
