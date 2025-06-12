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

type BaseRouteOptions = {
    method: HttpMethod
    path: string
    handler: RouteHandler
    additionalMiddleware?: RequestHandler[]
}

type GuestRouteOptions = BaseRouteOptions
type UnprotectedRouteOptions = BaseRouteOptions
type ProtectedRouteOptions = BaseRouteOptions
type WorkspaceRouteOptions = BaseRouteOptions & {
    enforcePolicy?: RequestHandler
}

export const createGuestRoute = ({
    method,
    path,
    handler,
    additionalMiddleware = [],
}: GuestRouteOptions) => {
    router[method](path, ...additionalMiddleware, asyncHandler(handler))
}

export const createRoute = ({
    method,
    path,
    handler,
    additionalMiddleware = [],
}: ProtectedRouteOptions) => {
    router[method](path, authMiddleware, twoFactorAuthMiddleware, ...additionalMiddleware, asyncHandler(handler))
}

export const createUnprotectedRoute = ({
    method,
    path,
    handler,
    additionalMiddleware = [],
}: UnprotectedRouteOptions) => {
    router[method](path, authMiddleware, ...additionalMiddleware, asyncHandler(handler))
}

export const createWorkspaceRoute = ({
    method,
    path,
    handler,
    enforcePolicy,
    additionalMiddleware = [],
}: WorkspaceRouteOptions) => {
    const finalPath = path.startsWith('/workspaces/:workspaceId')
        ? path
        : `/workspaces/:workspaceId${path}`

    const baseHandler = handler as RouteHandler

    const workspacePolicyMiddleware: RequestHandler[] = enforcePolicy ? [enforcePolicy] : []

    createRoute({
        method,
        path: finalPath,
        handler: baseHandler,
        additionalMiddleware: [
            workspaceMiddleware,
            ...workspacePolicyMiddleware,
            ...additionalMiddleware
        ]
    })
}