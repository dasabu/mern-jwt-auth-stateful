import express from 'express'
import { dashboardController } from '~/controllers/dashboard.controller'

const Router = express.Router()

Router.route('/access').get(dashboardController.access)

export const dashboardRoute = Router
