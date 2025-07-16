import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import mongoose from 'mongoose'
import validator from 'validator'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A name is necesary'],
    unique: true,
    trim: true,
    minLength: [4, 'You need a eight caracters'],
    maxLength: [24, 'Max Caracters in the name'],
  },
  password: {
    type: String,
    required: [true, 'You need a password'],
    trim: true,
    minLength: [6, 'You need a minimum of six numbers'],
    maxLength: [24, 'You pass the max of 24 date'],
    select: false,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  email: {
    type: String,
    required: [true, 'This input need your email is necesary'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  registeredAt: {
    type: Date,
    default: Date.now(),
  },
  photo: { type: String, default: 'default.jpg' },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
})

userSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } })
  next()
})

// Verifica atravez de un vitual que confirmPassword exista y confirma el password
userSchema
  .virtual('confirmPassword')
  .set(function(value) {
    this._confirmPassword = value
  })
  .get(function() {
    return this._confirmPassword
  })

userSchema.pre('save', function(next) {
  if (this.password !== this._confirmPassword) {
    return next(new Error('Password do not match'))
  }
  next()
})

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next()

  this.passwordChangedAt = Date.now() - 1000
  next()
})

userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next()

  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    )

    return JWTTimestamp < changedTimestamp
  }

  return false
}

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex')

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  console.log({ resetToken }, this.passwordResetToken)

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000

  return resetToken
}

const User = mongoose.model('User', userSchema)

export default User
