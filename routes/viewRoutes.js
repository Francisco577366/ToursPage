import express from 'express'
import * as authController from '../controllers/authController.js'
import * as viewController from '../controllers/viewController.js'

const router = express.Router()

router.get('/signup', viewController.signup)
router.get('/forgotPassword', viewController.renderForgotPassword)

router.get(
  '/',
  //bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewController.getOverview
)
router.get('/tours/:slug', authController.isLoggedIn, viewController.getTour)
router.get('/login', authController.isLoggedIn, viewController.login)
router.get('/me', authController.protect, viewController.getAccount)
router.get('/my-tours', authController.protect, viewController.getMyTours)

router.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData
)

export default router
