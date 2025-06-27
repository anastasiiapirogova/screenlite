import express, { RequestHandler } from 'express'
import { asyncHandler } from '../utils/asyncHandler.ts'
import { getImageThumbnail } from '@/modules/static/getImageThumbnail.ts'
import { getFile } from '@/modules/static/getFile.ts'

const router = express.Router()

enum HttpMethod {
    GET = 'get',
}

const createRoute = (method: HttpMethod, path: string, handler: (req: express.Request, res: express.Response) => Promise<void>, ...middlewares: RequestHandler[]) => {
    router[method](path, ...middlewares, asyncHandler(handler))
}

createRoute(HttpMethod.GET, '/thumbnail/*', getImageThumbnail)
createRoute(HttpMethod.GET, '/uploads/*', getFile)


export { router as staticRoutes }
