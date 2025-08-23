export class UserDeletionState {
    private _requestedAt: Date | null
    private _deletedAt: Date | null
  
    constructor(requestedAt: Date | null, deletedAt: Date | null) {
        this._requestedAt = requestedAt
        this._deletedAt = deletedAt
    }

    get requestedAt(): Date | null {
        return this._requestedAt
    }

    get deletedAt(): Date | null {
        return this._deletedAt
    }
  
    get isDeletionRequested(): boolean {
        return !!this.requestedAt
    }
  
    get isDeleted(): boolean {
        return !!this.deletedAt
    }
  
    get isActive(): boolean {
        return !this.requestedAt && !this.deletedAt
    }
  
    requestDeletion(): void {
        this._requestedAt = new Date()
    }
  
    cancelDeletionRequest(): void {
        this._requestedAt = null
    }
  
    markAsDeleted(): void {
        this._deletedAt = new Date()
    }
}