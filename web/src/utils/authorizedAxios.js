import axios from 'axios'
import { toast } from 'react-toastify'

let authorizedAxiosInstance = axios.create()

authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10 // 10 mins
/**
 * automatically attach cookie in each request to BE
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

authorizedAxiosInstance.interceptors.request.use(
  (response) => {
    // any status code falls outside the range of 2xx cause this function to trigger
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
