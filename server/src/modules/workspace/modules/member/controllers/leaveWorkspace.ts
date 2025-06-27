import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { MemberRepository } from '../repositories/MemberRepository.ts'

export const leaveWorkspace = async (req: Request, res: Response) => {
    const user = req.user!
    const workspace = req.workspace!

    await MemberRepository.removeMember(workspace.id, user.id)

    return ResponseHandler.ok(res)
}
