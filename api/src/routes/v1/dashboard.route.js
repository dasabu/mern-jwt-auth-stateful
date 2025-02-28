import express from 'express'
import { dashboardController } from '~/controllers/dashboard.controller'
import { authMiddleware } from '~/middlewares/auth.middleware'

const Router = express.Router()

Router.route('/access').get(
  // Middleware
  authMiddleware.isAuthorized,
  // Controller
  dashboardController.access
)

export const dashboardRoute = Router
