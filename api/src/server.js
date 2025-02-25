/* eslint-disable no-console */

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { corsOptions } from '~/config/cors'
import { env } from '~/config/env'
import { routerV1 } from './routes/v1'

const startServer = () => {
  const app = express() // Init Express App

  // Fix Cache from disk from ExpressJS
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })

  app.use(cookieParser()) // Use Cookie

  app.use(cors(corsOptions)) // Allow CORS

  app.use(express.json()) // Enable req.body json data

  app.use('/v1', routerV1) // Use Route APIs V1

  const { LOCAL_DEV_APP_HOST: host, LOCAL_DEV_APP_PORT: port } = env

  app.listen(port, host, () => {
    console.log(`Server is running successfully at ${host}:${port}`)
  })
}

;(async () => {
  try {
    // Start server
    console.log('Starting server...')
    startServer()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()
