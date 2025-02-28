import axios from 'axios'
import { toast } from 'react-toastify'
import { API_ROOT } from './constants'

let authorizedAxiosInstance = axios.create({
  baseURL: API_ROOT,
})

authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10 // 10 mins
/**
 * ! Cookie: automatically attach cookie in each request to BE
 * in case we use jwt (access and refresh) tokens by httpOnly cookie
 */
authorizedAxiosInstance.defaults.withCredentials = true

authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    // any status code lie within the range of 2xx cause this function to trigger
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    // any status code falls outside the range of 2xx cause this function to trigger
    const { url } = response.config
    if (url === '/v1/users/login') {
      const user = {
        id: response.data.id,
        email: response.data.email,
      }
      localStorage.setItem('user', JSON.stringify(user))
    } else if (url === '/v1/users/logout') {
      localStorage.removeItem('user')
    }
    return response
  },
  (error) => {
    // 410 GONE: use to get call refresh token api when current access token is expired
    if (error.response?.status !== 410) {
      toast.error(error.response?.data?.message || error?.message)
    }
    return Promise.reject(error)
  }
)

export default authorizedAxiosInstance
