import express from 'express'
import * as bookingController from '../controllers/bookingController.js'
import * as authController from './../controllers/authController.js'

const router = express.Router()

router.use(authController.protect)

router.get('/checkout-session/:tourID', bookingController.getCheckOutSession)

router.use(authController.restrictTo('adming', 'lead-guide'))

router
  .route('/')
  .get(bookingController.getAllBooking)
  .post(bookingController.createBooking)

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking)

export default router
