import express, { RequestHandler, Request, Response } from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { twoFactorAuthMiddleware } from '../middlewares/twoFactorAuthMiddleware.js'
import { workspaceMiddleware } from '../middlewares/workspaceMiddleware.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const router = express.Router()

export enum HttpMethod {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    DELETE = 'delete',
    PATCH = 'patch'
}

type RouteHandler = (req: Request, res: Response) => Promise<void>
type WorkspaceRouteHandler = (req: Request, res: Response) => Promise<void>

export const createGuestRoute = (method: HttpMethod, path: string, handler: RouteHandler, ...middlewares: RequestHandler[]) => {
    router[method](path, ...middlewares, asyncHandler(handler))
}

export const createRoute = (method: HttpMethod, path: string, handler: RouteHandler, ...middlewares: RequestHandler[]) => {
    router[method](path, authMiddleware, twoFactorAuthMiddleware, ...middlewares, asyncHandler(handler))
}

export const createUnprotectedRoute = (method: HttpMethod, path: string, handler: RouteHandler, ...middlewares: RequestHandler[]) => {
    router[method](path, authMiddleware, ...middlewares, asyncHandler(handler))
}

export const createWorkspaceRoute = (method: HttpMethod, path: string, handler: WorkspaceRouteHandler, ...additionalMiddleware: RequestHandler[]) => {
    if (!path.startsWith('/workspaces/:workspaceId')) {
        path = `/workspaces/:workspaceId${path}`
    }
    const baseHandler = handler as RouteHandler

    createRoute(method, path, baseHandler, workspaceMiddleware, ...additionalMiddleware)
}