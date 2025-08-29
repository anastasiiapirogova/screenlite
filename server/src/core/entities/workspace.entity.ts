import { WorkspaceDTO } from '@/shared/dto/workspace.dto.ts'
import { WorkspaceName } from '../value-objects/workspace-name.vo.ts'
import { WorkspaceSlug } from '../value-objects/workspace-slug.vo.ts'
import { WorkspaceStateVO } from '../value-objects/workspace-state.vo.ts'

export class Workspace {
    public readonly id: string
    private _name: WorkspaceName
    private _slug: WorkspaceSlug
    public readonly createdAt: Date
    public updatedAt: Date
    public picturePath: string | null
    public state: WorkspaceStateVO

    constructor(props: WorkspaceDTO) {
        this.id = props.id
        this._name = new WorkspaceName(props.name)
        this._slug = new WorkspaceSlug(props.slug)
        this.state = new WorkspaceStateVO(props.status, props.deletedAt)
        this.createdAt = props.createdAt
        this.updatedAt = props.updatedAt
        this.picturePath = props.picturePath
    }

    get name() {
        return this._name.value
    }

    get slug() {
        return this._slug.value
    }
    set name(name: string) {
        this._name = new WorkspaceName(name)
    }

    set slug(slug: string) {
        this._slug = new WorkspaceSlug(slug)
    }
}