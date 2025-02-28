import { StatusCodes } from 'http-status-codes'
import ms from 'ms'
import { env } from '~/config/env'
import { JwtProvider } from '~/providers/jwt.provider'

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

    // Create payload
    const user = {
      id: req.body.email,
      email: req.body.password,
    }

    // Create access token
    const accessToken = await JwtProvider.generateToken(
      user,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      '1h'
    )

    // Create refresh token
    const refreshToken = await JwtProvider.generateToken(
      user,
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      '14 days' // must be longer than access token expired time
    )

    // Set cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days'), // same with refresh token expired time, but must be different with access token expired time
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days'), // same with refresh token expired time, but must be different with access token expired time
    })

    // Return user info and tokens for FE (will store them in local storage)
    res.status(StatusCodes.OK).json({ ...user, accessToken, refreshToken })
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
