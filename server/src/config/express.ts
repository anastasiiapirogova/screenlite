import express, { NextFunction, Request, Response } from 'express'
import { createServer } from 'node:http'
import bodyParser from 'body-parser'
import path from 'path'
import * as i18nextMiddleware from 'i18next-http-middleware'
import { User } from 'generated/prisma/client.js'
import { corsMiddleware } from '../middlewares/corsMiddleware.js'
import { i18n } from './i18n.js'
import { guestRoutes } from '../routes/guest.js'
import { authRoutes } from '../routes/auth.js'
import { staticRoutes } from '../routes/static.js'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { ResponseHandler } from '@utils/ResponseHandler.js'

const __filename = fileURLToPath(import.meta.url)

const __dirname = dirname(__filename)

declare module 'express-serve-static-core' {
    interface Request {
        user?: Omit<User, 'password'>
        token?: string
    }
}

const errorHandler = (error: Error, _req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
        return next(error)
    }
    console.log(error.stack)
    ResponseHandler.serverError(res)
}

const app = express()

const server = createServer(app)

app.use(corsMiddleware)

app.use(i18nextMiddleware.handle(i18n))

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ extended: true }))
app.enable('etag')

app.use('/api/static', staticRoutes)
app.use('/api', guestRoutes)
app.use('/api', authRoutes)

// app.use(express.static(path.join(__dirname, '../../../client/dist/')))

app.use('/api/*', (_req: Request, res: Response) => {
    ResponseHandler.notFound(res)
})

// app.get(/^((?!\/socket\.io).)*$/, (_req: Request, res: Response) => {
//     res.sendFile(path.join(__dirname, '../../../client/dist/index.html'))
// })

app.use(errorHandler)

server.listen(3000, () => {
    console.log('Server running on port 3000')
})

export { app, server }
