import { IAdminPermissionRepository } from '@/modules/admin-permission/domain/ports/admin-permission-repository.interface.ts'
import { AdminPermission } from '@/core/entities/admin-permission.entity.ts'
import { AdminPermission as PrismaAdminPermission } from '@/generated/prisma/client.ts'
import { PrismaClient } from '@prisma/client'
import { Prisma } from '@/generated/prisma/client.ts'
import { AdminPermissionName } from '@/core/enums/admin-permission-name.enum.ts'

export class PrismaAdminPermissionRepository implements IAdminPermissionRepository {
    constructor(private readonly prisma: PrismaClient | Prisma.TransactionClient) {}

    async upsert(permission: AdminPermission): Promise<AdminPermission> {
        const data = this.toPersistence(permission)

        const result = await this.prisma.adminPermission.upsert({
            where: { name: permission.name },
            update: data,
            create: data,
        })

        return this.toDomain(result)
    }

    async findById(id: string): Promise<AdminPermission | null> {
        const permission = await this.prisma.adminPermission.findUnique({
            where: { id },
        })

        return permission ? this.toDomain(permission) : null
    }

    async findByName(name: AdminPermissionName): Promise<AdminPermission | null> {
        const permission = await this.prisma.adminPermission.findUnique({
            where: { name },
        })

        return permission ? this.toDomain(permission) : null
    }

    async findAll(): Promise<AdminPermission[]> {
        const permissions = await this.prisma.adminPermission.findMany()

        return permissions.map(this.toDomain)
    }

    async deleteByName(name: AdminPermissionName): Promise<void> {
        await this.prisma.adminPermission.delete({
            where: { name },
        })
    }

    private toPersistence(permission: AdminPermission): PrismaAdminPermission {
        return {
            id: permission.id,
            name: permission.name,
            description: permission.description,
        }
    }

    private toDomain(permission: PrismaAdminPermission): AdminPermission {
        return new AdminPermission(
            permission.id,
            permission.name as AdminPermissionName,
            permission.description,
        )
    }
}