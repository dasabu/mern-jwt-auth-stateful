import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/env'
import { JwtProvider } from '~/providers/jwt.provider'

const isAuthorized = async (req, res, next) => {
  /**
   * Method 1: Get access token from request cookies
   * axios.defaults.credentials = true (FE)
   * corsOption.credentials = true (BE)
   */
  const accessToken = req.cookies?.accessToken
  if (!accessToken) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Unauthorized: Token not found' })
    return
  }

  try {
    // decode token
    const accessTokenDecoded = await JwtProvider.verifyToken(
      accessToken,
      env.ACCESS_TOKEN_SECRET_SIGNATURE
    )
    // attach decoded info into request (need for behind layers like controller)
    req.jwtDecoded = accessTokenDecoded
    // allow request to continue
    next()
  } catch (error) {
    if (error.message?.includes('jwt expired')) {
      /**
       * Case 1: access token is expired: Return status code 410 GONE
       * so that FE knows to call the API to refresh the access token
       */
      res
        .status(StatusCodes.GONE)
        .json({ message: 'Need to refresh the access token' })
    } else {
      /**
       * Case 2: access token is invalid (not expired): Returns error code 401 UNAUTHORIZE
       * so that FE knows to call the logout API
       */
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: 'Unauthorized: Invalid token' })
    }
  }

  /**
   * Method 2: Get access token from header
   * in case FE save access token in Local Storage and attach it in request headers in every request
   * const accessToken = req.headers.authorization
   */
}

export const authMiddleware = {
  isAuthorized,
}
