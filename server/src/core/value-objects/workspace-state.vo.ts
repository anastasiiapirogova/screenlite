import { WorkspaceStatus } from '@/core/enums/workspace-status.enum.ts'

export class WorkspaceStateVO {
    private _status : WorkspaceStatus
    private _deletedAt: Date | null

    constructor(status: WorkspaceStatus, deletedAt: Date | null) {
        this._status = status
        this._deletedAt = deletedAt
    }

    get status() {
        return this._status
    }

    get deletedAt() {
        return this._deletedAt
    }

    isActive() {
        return this._status === WorkspaceStatus.ACTIVE
    }

    isDeleted() {
        return this._status === WorkspaceStatus.DELETED
    }

    markAsDeleted() {
        this._status = WorkspaceStatus.DELETED
        this._deletedAt = new Date()
    }

    restore() {
        this._status = WorkspaceStatus.ACTIVE
        this._deletedAt = null
    }
}