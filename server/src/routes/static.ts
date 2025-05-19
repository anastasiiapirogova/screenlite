import express from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { getImageThumbnail } from '@modules/static/getImageThumbnail.js'

const router = express.Router()

enum HttpMethod {
    GET = 'get',
    POST = 'post'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createRoute = (method: HttpMethod, path: string, handler: any) => {
    router[method](path, asyncHandler(handler))
}

createRoute(HttpMethod.GET, '/thumbnail/*', getImageThumbnail)

export { router as staticRoutes }
