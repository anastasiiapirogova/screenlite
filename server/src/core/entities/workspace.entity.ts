import { WorkspaceDTO } from '@/shared/dto/workspace.dto.ts'
import { WorkspaceStatus } from '../enums/workspace-status.enum.ts'
import { WorkspaceName } from '../value-objects/workspace-name.vo.ts'
import { WorkspaceSlug } from '../value-objects/workspace-slug.vo.ts'

export class Workspace {
    public readonly id: string
    public name: WorkspaceName
    public slug: WorkspaceSlug
    public status: WorkspaceStatus
    public readonly createdAt: Date
    public updatedAt: Date
    public deletedAt: Date | null
    public picturePath: string | null

    constructor(props: WorkspaceDTO) {
        this.id = props.id
        this.name = new WorkspaceName(props.name)
        this.slug = new WorkspaceSlug(props.slug)
        this.status = props.status
        this.createdAt = props.createdAt
        this.updatedAt = props.updatedAt
        this.deletedAt = props.deletedAt
        this.picturePath = props.picturePath
    }

    static create(props: {
        name: string
        slug: string
    }): Workspace {
        const id = crypto.randomUUID()
        const now = new Date()
    
        return new Workspace({
            id,
            name: props.name,
            slug: props.slug,
            status: WorkspaceStatus.ACTIVE,
            createdAt: now,
            updatedAt: now,
            deletedAt: null,
            picturePath: null
        })
    }

    updateDetails(props: { name?: string, slug?: string }) {
        if (props.name) this.name = new WorkspaceName(props.name)
        if (props.slug) this.slug = new WorkspaceSlug(props.slug)
    }

    isDeleted() {
        return this.deletedAt !== null
    }

    markAsDeleted() {
        this.deletedAt = new Date()
        this.status = WorkspaceStatus.DELETED
    }
}