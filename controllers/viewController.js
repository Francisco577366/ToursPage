import Booking from '../models/bookingModel.js'
import tour from '../models/tourModel.js'
import User from '../models/UserModel.js'
import AppError from '../utils/appError.js'
import catchAsync from '../utils/catchAsync.js'

export const alerts = (req, res, next) => {
  const { alert } = req.query
  if (alert === 'booking')
    res.locals.alert =
      'Your booking was successfull please check your email for a confirmation If your booking doesnt show up here immediatly, please come back later. '
  next()
}

export const getOverview = catchAsync(async (req, res) => {
  const tours = await tour.find()
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  })
})

export const getTour = catchAsync(async (req, res, next) => {
  const Tour = await tour
    .findOne({ slug: req.params.slug })
    .populate({ path: 'reviews', fields: 'review rating user' })

  if (!Tour) {
    return next(new AppError('There is no tour with that name', 404))
  }

  res.status(200).render('tour', {
    title: `${Tour.name} Tour`,
    Tour,
  })
})

export const login = catchAsync(async (req, res) => {
  res.status(200).render('login', {
    title: `login`,
  })
})

export const signup = catchAsync(async (req, res) => {
  res.status(200).render('signup', {
    title: `signup`,
  })
})

export const getMyTours = async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id })

  const tourIDs = bookings.map(el => el.tour)
  console.log(tourIDs)
  const tours = await tour.find({ _id: { $in: tourIDs } })
  console.log(tours)
  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  })
}

export const getAccount = catchAsync(async (req, res) => {
  res.status(200).render('account', {
    title: `Your account`,
  })
})

export const updateUserData = catchAsync(async (req, res, next) => {
  const updateUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  )

  res.status(200).render('account', {
    title: `Your account`,
    user: updateUser,
  })
})

//
export const renderForgotPassword = catchAsync(async (req, res) => {
  res.status(200).render('forgot', {
    title: `forgot`,
  })
})
