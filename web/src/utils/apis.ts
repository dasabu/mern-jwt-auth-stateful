import authorizedAxiosInstance from './authorizedAxios'

export const login = async (data) => {
  return await authorizedAxiosInstance.post('/v1/users/login', data)
}

export const access = async () => {
  return await authorizedAxiosInstance.get('/v1/dashboard/access')
}

export const logout = async () => {
  return await authorizedAxiosInstance.delete('/v1/users/logout')
}

export const refreshToken = async () => {
  return await authorizedAxiosInstance.put('/v1/users/refresh-token')
}
