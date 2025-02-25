import { StatusCodes } from 'http-status-codes'
// import ms from 'ms'
import { env } from '~/config/env'

const login = async (req, res) => {
  try {
    if (
      req.body.email !== env.MOCK_DATABASE.USER.EMAIL ||
      req.body.password !== env.MOCK_DATABASE.USER.PASSWORD
    ) {
      res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: 'Incorrect credentials' })
      return
    }

    res.status(StatusCodes.OK).json({ message: 'Login successfully' })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

const logout = async (req, res) => {
  try {
    // Do something
    res.status(StatusCodes.OK).json({ message: 'Logout successfully' })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

const refreshToken = async (req, res) => {
  try {
    // Do something
    res
      .status(StatusCodes.OK)
      .json({ message: 'Get refresh token successfully' })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

export const userController = {
  login,
  logout,
  refreshToken,
}
