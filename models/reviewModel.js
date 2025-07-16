import mongoose from 'mongoose'
import Tour from './tourModel.js'

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    Tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    User: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

reviewSchema.index({ Tour: 1, User: 1 }, { unique: true })

reviewSchema.pre(/^find/, function(next) {
  /* this.populate({
    path: 'Tour',
    select: 'name',
  }).populate({
    path: 'User',
    select: 'name photo',
  })

  next()
  */

  this.populate({
    path: 'User',
    select: 'name photo',
  })

  next()
})

reviewSchema.statics.calcAverageRatings = async function(tourID) {
  const stats = await this.aggregate([
    {
      $match: { Tour: tourID },
    },
    {
      $group: {
        _id: '$Tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ])

  console.log(stats)
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourID, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    })
  } else {
    await Tour.findByIdAndUpdate(tourID, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    })
  }
}

reviewSchema.post('save', function() {
  // this points to current review
  this.constructor.calcAverageRatings(this.Tour)
})

reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne()
  console.log(this.r)
  next()
})

reviewSchema.post(/^findOneAnd/, async function() {
  await this.r.constructor.calcAverageRatings(this.r.Tour)
})

const Review = mongoose.model('Review', reviewSchema)

export default Review
