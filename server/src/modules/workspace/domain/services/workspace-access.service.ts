import { IWorkspaceMemberRepository } from '@/modules/workspace-member/domain/ports/workspace-member-repository.interface.ts'
import { AuthContext } from '@/core/types/auth-context.type.ts'
import { IWorkspaceAccessService } from '../ports/workspace-access-service.interface.ts'
import { WorkspaceAccess } from '../value-objects/workspace-access.vo.ts'

export class WorkspaceAccessService implements IWorkspaceAccessService {
    constructor(private readonly memberRepo: IWorkspaceMemberRepository) {}
  
    async checkAccess(workspaceId: string, authContext: AuthContext) {
        if (authContext.isUserContext()) {
            const member = await this.memberRepo.findByWorkspaceAndUser(
                workspaceId, 
                authContext.user.id
            )

            if (member) {
                return new WorkspaceAccess(true, false, member)
            }
        }

        if (authContext.isWorkspaceApiKeyContext()) {
            return new WorkspaceAccess(true, true, null)
        }

        return new WorkspaceAccess(false, false, null)
    }
}