import express, { RequestHandler } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { getImageThumbnail } from '@modules/static/getImageThumbnail.js'

const router = express.Router()

enum HttpMethod {
    GET = 'get',
}

const createRoute = (method: HttpMethod, path: string, handler: (req: express.Request, res: express.Response) => Promise<void>, ...middlewares: RequestHandler[]) => {
    router[method](path, ...middlewares, asyncHandler(handler))
}

createRoute(HttpMethod.GET, '/thumbnail/*', getImageThumbnail)

export { router as staticRoutes }
