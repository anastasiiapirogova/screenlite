import { ResponseHandler } from '@utils/ResponseHandler.js'
import { NextFunction, Request, Response } from 'express'

export type EnforceWorkspacePolicyParams = {
    permission: string
}

export const enforceWorkspacePolicy = ({
    permission,
}: EnforceWorkspacePolicyParams) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const { currentUserAccess } = req.workspace!

        const hasPermission = currentUserAccess.permissions[permission]

        if (!hasPermission) {
            return ResponseHandler.forbidden(res, 'PERMISSION_DENIED')
        }

        next()
    }
}