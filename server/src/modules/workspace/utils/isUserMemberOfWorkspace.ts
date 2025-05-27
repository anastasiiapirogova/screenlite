import { UserWorkspace } from 'generated/prisma/client.js'

export const isUserMemberOfWorkspace = (userId: string, members: UserWorkspace[]): boolean => {
    return members.some(member => member.userId === userId)
}