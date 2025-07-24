import { AdminPermissionDTO } from '../dto/admin-permission.dto.ts'
import { AdminPermissionName } from '../enums/admin-permission-name.enum.ts'

export class AdminPermission {
    constructor(
        public readonly id: string,
        public readonly name: AdminPermissionName,
        private _description: string | null,
    ) {}

    get description(): string | null {
        return this._description
    }

    setDescription(description: string | null): void {
        this._description = description
    }

    toDTO(): AdminPermissionDTO {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
        }
    }
}