import { WorkspaceMember } from '@/core/entities/workspace-member.entity.ts'

export class WorkspaceAccess {
    constructor(
        public readonly hasAccess: boolean,
        public readonly apiKey: boolean,
        public readonly member: WorkspaceMember | null
    ) {}
}