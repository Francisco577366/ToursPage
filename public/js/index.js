import '@babel/polyfill'
import { showAlert } from './alert'
import * as change from './forgot.js'
import './login.js'
import { login, logout } from './login.js'
import { displayMap } from './mapbox.js'
import { registerUser } from './register.js'
import { bookTour } from './stripe.js'
import { updateSettings } from './updateSettings.js'

const mapBox = document.getElementById('map')
const loginForm = document.querySelector('.form--login')
const logOutBtn = document.querySelector('.nav__el--logout')
const userDataForm = document.querySelector('.form-user-data')
const userPasswordForm = document.querySelector('.form-user-password')
const registerForm = document.querySelector('.register-form')
const sendRecoverEmail = document.getElementById('sendRecoverEmail')
const resetForm = document.getElementById('resetForm')
const bookBtn = document.getElementById('book-tour')

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations)
  displayMap(locations)
}

if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault()
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    login(email, password)
  })
}

if (logOutBtn) logOutBtn.addEventListener('click', logout)

if (userDataForm)
  userDataForm.addEventListener('submit', e => {
    e.preventDefault()
    const form = new FormData()
    form.append('name', document.getElementById('name').value)
    form.append('email', document.getElementById('email').value)
    form.append('photo', document.getElementById('photo').files[0])
    console.log(form)
    updateSettings(form, 'data')
  })

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault()
    document.querySelector('.btn--save-password').textContent = 'Updating...'
    const currentPassword = document.getElementById('password-current').value
    const password = document.getElementById('password').value
    const confirmPassword = document.getElementById('password-confirm').value
    await updateSettings(
      { currentPassword, password, confirmPassword },
      'password'
    )
    document.querySelector('.btn--save-password').textContent = 'Save password'
    document.getElementById('password-current').value = ''
    document.getElementById('password').value = ''
    document.getElementById('password-confirm').value = ''
  })

if (registerForm)
  registerForm.addEventListener('submit', async e => {
    e.preventDefault()
    const name = document.getElementById('nameRegister').value
    const email = document.getElementById('emailRegister').value
    const password = document.getElementById('passwordRegister').value
    const confirmPassword = document.getElementById('ConfirmPasswordRegister')
      .value

    await registerUser({ name, email, password, confirmPassword })
    document.getElementById('nameRegister').value = ''
    document.getElementById('emailRegister').value = ''
    document.getElementById('passwordRegister').value = ''
    document.getElementById('ConfirmPasswordRegister').value = ''
  })

if (sendRecoverEmail)
  sendRecoverEmail.addEventListener('submit', async e => {
    e.preventDefault()
    const email = document.getElementById('yourEmail').value

    change.forgotPassword({ email })
  })

if (resetForm)
  resetForm.addEventListener('submit', async e => {
    e.preventDefault()
    const password = document.getElementById('passwordReset').value
    const passwordReset = document.getElementById('confirmPasswordReset').value

    change.passwordChange(password, passwordReset)
  })

if (bookBtn)
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing....'
    const { tourId } = e.target.dataset
    bookTour(tourId)
  })

const alertMessage = document.querySelector('body').dataset.alert
if (alertMessage) showAlert('success', alertMessage, 20)
