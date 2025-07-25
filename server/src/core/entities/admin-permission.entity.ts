import { AdminPermissionName } from '@/core/enums/admin-permission-name.enum.ts'

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
}