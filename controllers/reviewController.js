import Reviews from '../models/reviewModel.js'
import * as factory from './handlerFactory.js'

export const setTourUserIds = (req, res, next) => {
  if (!req.body.Tour) req.body.Tour = req.params.tourId
  if (!req.body.User) req.body.User = req.user.id
  next()
}

export const getAllReviews = factory.getAll(Reviews)
export const getReview = factory.getOne(Reviews)
export const deleteReview = factory.deleteOne(Reviews)
export const updateReview = factory.updateOne(Reviews)
export const createReview = factory.createOne(Reviews)
