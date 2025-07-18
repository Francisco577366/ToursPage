/* exlint-disable */
import axios from 'axios'
import { showAlert } from './alert.js'

export const updateSettings = async (data, type) => {
  try {
    console.log(data)
    const url =
      type === 'password'
        ? 'https://tourspage-production.up.railway.app/api/v1/users/updatePassword'
        : 'https://tourspage-production.up.railway.app/api/v1/users/updateMe'

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    })
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`)
    }
  } catch (err) {
    showAlert('error', err.response.data.message)
  }
}
