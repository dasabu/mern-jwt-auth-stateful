import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/env'

const access = async (req, res) => {
  try {
    const user = { email: env.MOCK_DATABASE.USER.EMAIL }

    res.status(StatusCodes.OK).json(user)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

export const dashboardController = {
  access,
}
