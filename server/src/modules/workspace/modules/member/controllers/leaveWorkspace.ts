import { Request, Response } from 'express'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { MemberRepository } from '../repositories/MemberRepository.js'

export const leaveWorkspace = async (req: Request, res: Response) => {
    const user = req.user!
    const workspace = req.workspace!

    await MemberRepository.removeMember(workspace.id, user.id)

    return ResponseHandler.ok(res)
}
