import { IUserAdminPermissionRepository } from '@/core/ports/user-admin-permission-repository.interface.ts'
import { Prisma, PrismaClient, User as PrismaUser } from '@/generated/prisma/client.ts'
import { AdminPermissionName } from '@/core/enums/admin-permission-name.enum.ts'
import { User } from '@/core/entities/user.entity.ts'
import { UserRole } from '@/core/enums/user-role.enum.ts'

export class PrismaUserAdminPermissionRepository implements IUserAdminPermissionRepository {
    constructor(private readonly prisma: PrismaClient | Prisma.TransactionClient) {}

    async assignPermissionsToUser(userId: string, permissionNames: AdminPermissionName[]): Promise<void> {
        const permissions = await this.prisma.adminPermission.findMany({
            where: { name: { in: permissionNames } },
        })

        await this.prisma.userAdminPermission.createMany({
            data: permissions.map((permission) => ({ userId, permissionId: permission.id })),
        })
    }

    async revokePermissionFromUser(userId: string, permissionName: AdminPermissionName): Promise<void> {
        const permission = await this.prisma.adminPermission.findUnique({
            where: { name: permissionName },
        })

        if (!permission) {
            return
        }

        await this.prisma.userAdminPermission.delete({
            where: { userId_permissionId: { userId, permissionId: permission.id } },
        })
    }

    async getUserPermissions(userId: string): Promise<AdminPermissionName[]> {
        const permissions = await this.prisma.userAdminPermission.findMany({
            where: { userId },
            select: {
                permission: {
                    select: {
                        name: true,
                    },
                },
            },
        })

        return permissions.map((permission) => permission.permission.name as AdminPermissionName)
    }

    async userHasPermission(userId: string, permissionName: AdminPermissionName): Promise<boolean> {
        const permission = await this.prisma.adminPermission.findUnique({
            where: { name: permissionName },
        })

        if (!permission) {
            return false
        }

        const userPermission = await this.prisma.userAdminPermission.findFirst({
            where: { userId, permissionId: permission.id },
        })

        return !!userPermission
    }

    async getUsersWithPermission(permissionName: AdminPermissionName): Promise<User[]> {
        const permission = await this.prisma.adminPermission.findUnique({
            where: { name: permissionName },
        })

        if (!permission) {
            return []
        }

        const users = await this.prisma.userAdminPermission.findMany({
            where: { permissionId: permission.id },
            include: {
                user: true,
            },
        })

        return users.map((user) => this.userToDomain(user.user))
    }

    private userToDomain(prismaUser: PrismaUser): User {
        return new User({
            id: prismaUser.id,
            email: prismaUser.email,
            pendingEmail: prismaUser.pendingEmail,
            name: prismaUser.name,
            password: prismaUser.password,
            passwordUpdatedAt: prismaUser.passwordUpdatedAt,
            totpSecret: prismaUser.totpSecret,
            twoFactorEnabled: prismaUser.twoFactorEnabled,
            profilePhoto: prismaUser.profilePhoto,
            emailVerifiedAt: prismaUser.emailVerifiedAt,
            deletionRequestedAt: prismaUser.deletionRequestedAt,
            deletedAt: prismaUser.deletedAt,
            role: prismaUser.role as UserRole,
        })
    }
}