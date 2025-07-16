import express from 'express'

import * as authController from '../controllers/authController.js'

import * as userController from '../controllers/userController.js'

const router = express.Router()

router.get('/resetPassword/:token', (req, res) => {
  res.render('resetPassword', {
    token: req.params.token,
  })
})

router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.get('/logout', authController.logout)
router.post('/forgotPassword', authController.forgotPassword)
router.patch('/resetPassword/:token', authController.resetPassword)

router.use(authController.protect)

router.patch('/updatePassword', authController.updatePassword)

router.get('/me', userController.getMe, userController.getUser)
router.delete('/deleteMe', userController.deleteMe)
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.reSizeUserPhoto,
  userController.updateMe
)

router.use(authController.restrictTo('admin'))

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser)

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser)

export default router
