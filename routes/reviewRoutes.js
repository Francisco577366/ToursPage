import express from 'express'
import * as reviewController from '../controllers/reviewController.js'
import * as authController from './../controllers/authController.js'

const router = express.Router({ mergeParams: true })

router.use(authController.protect)

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  )

router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  )
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  )

export default router
