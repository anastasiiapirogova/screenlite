import { UserWorkspace } from '@prisma/client'

export const isUserMemberOfWorkspace = (userId: string, members: UserWorkspace[]): boolean => {
    return members.some(member => member.userId === userId)
}