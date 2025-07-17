import cookieParser from 'cookie-parser'
import express from 'express'
import mongoSanitize from 'express-mongo-sanitize'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import hpp from 'hpp'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import xss from 'xss-clean'
import globalErrorHandler from './controllers/errorController.js'
import bookingRouter from './routes/bookingRoutes.js'
import reviewRouter from './routes/reviewRoutes.js'
import tourRouter from './routes/tourRoutes.js'
import userRouter from './routes/userRoutes.js'
import viewRouter from './routes/viewRoutes.js'
import AppError from './utils/appError.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

// Set Security HTTP Headers
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        'default-src': ["'self'"],
        'script-src': [
          "'self'",
          'https://unpkg.com',
          'https://cdn.jsdelivr.net',
          'https://js.stripe.com',
        ],
        'style-src': [
          "'self'",
          'https://unpkg.com',
          'https://fonts.googleapis.com',
        ],
        'font-src': ["'self'", 'https://fonts.gstatic.com'],
        'img-src': [
          "'self'",
          'data:',
          'blob:',
          'https://unpkg.com',
          'https://*.tile.openstreetmap.org',
        ],
        'connect-src': ["'self'", 'ws:', 'http://127.0.0.1:*'],
        'object-src': ["'none'"],
        'frame-ancestors': ["'self'"],
        'frame-src': ["'self'", 'https://js.stripe.com'],
      },
    },
  })
)
// 1) GLOBAL MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Limit request from same Api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in a hour',
})

app.use('/api', limiter)

// Body parser, reading data from body into req.body
app.use(
  express.json({
    limit: '10kb',
  })
)

app.use(cookieParser())

// Data sanitization again NoSQL query injection
app.use(mongoSanitize())

// Data sanitization against XSS
app.use(xss())

//
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
)

app.use(express.json())

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  next()
})

// 3) ROUTES
app.use('/', viewRouter)
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/bookings', bookingRouter)

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.use(globalErrorHandler)

export default app
