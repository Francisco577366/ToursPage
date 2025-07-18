import axios from 'axios'
import { showAlert } from './alert'

export const registerUser = async data => {
  try {
    const res = await axios({
      method: 'POST',
      url:
        process.env.NODE_ENV === 'development'
          ? `https://tourspage-production.up.railway.app/api/v1/users/signup`
          : 'http://127.0.0.1:3000/api/v1/users/signup',
      data,
    })
    if (res.data.status === 'success') {
      showAlert('success', 'Your register is success Check Your email.')
    }
  } catch (err) {
    const message = err.response?.data?.message || ''

    if (message.includes('duplicate key') && message.includes('name')) {
      showAlert(
        'error',
        'This name is already in use. Please chooose another one'
      )
    } else if (message.includes('duplicate key') && message.includes('email')) {
      showAlert(
        'error',
        'This email is already registered. Try logging in or use another address '
      )
    } else {
      showAlert('error', 'Registration failed. Please try again')
    }
  }
}
