import express, { RequestHandler, Request, Response } from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.ts'
import { twoFactorAuthMiddleware } from '../middlewares/twoFactorAuthMiddleware.ts'
import { workspaceMiddleware } from '../middlewares/workspaceMiddleware.ts'
import { asyncHandler } from '../utils/asyncHandler.ts'

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
type TwoFaCheckDisabledRouteOptions = BaseRouteOptions
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

export const createRouteWithoutTwoFACheck = ({
    method,
    path,
    handler,
    additionalMiddleware = [],
}: TwoFaCheckDisabledRouteOptions) => {
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