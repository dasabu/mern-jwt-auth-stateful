import axios from 'axios'
import { toast } from 'react-toastify'
import { API_ROOT } from './constants'
import { logout, refreshToken } from './apis'

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

/**
 * This is for ensure only 1 refresh-token API is called
 */
let refreshTokenPromise = null

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
    const { status } = error.response
    // 401 UNAUTHORIZED: call logout API
    if (status === 401) {
      logout().then(() => {
        location.href = '/login' // same with navigate('/login')
      })
    }
    // 410 GONE: call refresh token API when current access token is expired
    // error.config: get all erroneous request(s) API
    if (status === 410 && error.config) {
      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshToken()
          .then((res) => {
            /**
             * In case using local storage:
             * const { accessToken } = res.data
             * localStorage.setItem('accessToken', accessToken)
             * authorizedAxiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`
             *
             * If not (use cookie), this then() is not needed, can be removed
             */
          })
          .catch((err) => {
            // When refresh token API return error: call logout API
            logout().then(() => {
              location.href = '/login' // same with navigate('/login')
            })
            return Promise.reject(err)
          })
          .finally(() => {
            // Re-call erroneous request(s) API
            refreshTokenPromise = null
          })
      }
      // Succeed: return refreshTokenPromise
      return refreshTokenPromise.then(() => {
        // Re-call error APIs
        return authorizedAxiosInstance(error.config)
      })
    } else {
      toast.error(error.response?.data?.message || error?.message)
    }
    return Promise.reject(error)
  }
)

export default authorizedAxiosInstance
