import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { userRoute } from '~/routes/v1/user.route'
import { dashboardRoute } from '~/routes/v1/dashboard.route'

const Router = express.Router()

/* Check status of APIs v1 */
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs V1 are ready to use.' })
})

Router.use('/users', userRoute)

Router.use('/dashboard', dashboardRoute)

export const routerV1 = Router
