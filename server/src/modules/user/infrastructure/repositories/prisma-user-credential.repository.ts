import { Prisma, PrismaClient } from '@/generated/prisma/client.ts'
import { IUserCredential } from '@/core/ports/user-credential.interface.ts'
import { UserPassword } from '@/core/entities/user-password.entity.ts'
import { UserCredentialType } from '@/core/enums/user-credential-type.enum.ts'
import { UserCredentialWhereUniqueInput } from '@/generated/prisma/models.ts'
import { IUserCredentialRepository } from '@/core/ports/user-credential-repository.interface.ts'

export class PrismaUserCredentialRepository implements IUserCredentialRepository {
    constructor(private readonly prisma: PrismaClient | Prisma.TransactionClient) {}

    async findByUserId(userId: string): Promise<IUserCredential[]> {
        const records = await this.prisma.userCredential.findMany({ where: { userId } })
      
        return records
            .filter(record => {
                if (record.type === UserCredentialType.PASSWORD) {
                    return record.passwordHash && record.passwordUpdatedAt
                }
                return false
            })
            .map(record => {
                switch (record.type) {
                    case UserCredentialType.PASSWORD:
                        return new UserPassword(record.id, record.userId, record.passwordHash!, record.passwordUpdatedAt!)
                    default:
                        throw new Error(`Unsupported credential type: ${record.type}`)
                }
            })
    }

    async save(credential: IUserCredential): Promise<void> {
        switch (credential.type) {
            case UserCredentialType.PASSWORD: {
                const password = credential as unknown as UserPassword

                const where: UserCredentialWhereUniqueInput = {
                    id: password.id,
                    userId: password.userId,
                }

                await this.prisma.userCredential.upsert({
                    where,
                    create: {
                        userId: password.userId,
                        type: UserCredentialType.PASSWORD,
                        passwordHash: password.passwordHash,
                        passwordUpdatedAt: password.passwordUpdatedAt,
                    },
                    update: {
                        passwordHash: password.passwordHash,
                        passwordUpdatedAt: password.passwordUpdatedAt,
                    },
                })
                break
            }

            default:
                throw new Error(`Unsupported credential type: ${credential.type}`)
        }
    }

    async delete(id: string): Promise<void> {
        await this.prisma.userCredential.delete({
            where: { id },
        }).catch((err) => {
            if (err.code !== 'P2025') throw err
        })
    }
}
