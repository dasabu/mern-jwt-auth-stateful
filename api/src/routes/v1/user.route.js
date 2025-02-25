import express from 'express'
import { userController } from '~/controllers/user.controller'

const Router = express.Router()

Router.route('/login').post(userController.login)

Router.route('/logout').delete(userController.logout)

Router.route('/refresh-token').put(userController.refreshToken)

export const userRoute = Router
