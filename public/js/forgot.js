import axios from 'axios'
import { showAlert } from './alert'

export const forgotPassword = async email => {
  const disableButton = document.getElementById('recoverBtn')
  if (disableButton) disableButton.disabled = true

  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/forgotPassword',
      data: email,
    })

    if (res.data.status === 'success') {
      showAlert('success', 'Your email has been sent. Please wait 60 seconds.')

      setTimeout(() => {
        if (disableButton) disableButton.disabled = false
        showAlert('success', 'You cant resend the email now')
      }, 60000)
    }
  } catch (err) {
    showAlert('error', err.response.data.message)
    if (disableButton) disableButton.disabled = false
  }
}

export const passwordChange = async (password, passwordReset) => {
  const token = window.location.pathname.split('/').pop()
  const disableButton = document.getElementById('submitBtn')
  if (disableButton) disableButton.disabled = true
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/resetPassword/${token}`,
      data: {
        password,
        confirmPassword: passwordReset,
      },
    })

    if (res.data.status === 'success') {
      showAlert('success', 'Your password is changed')
      window.setTimeout(() => {
        location.assign('/login')
      }, 1500)
    }
  } catch (err) {
    showAlert('error', err.response.data.message)
    if (disableButton) disableButton.disabled = false
  }
}
