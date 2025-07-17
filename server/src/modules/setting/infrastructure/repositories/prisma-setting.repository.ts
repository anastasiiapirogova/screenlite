import { SettingRepository } from '../../domain/setting.repository.ts'
import { PrismaClient } from '@/generated/prisma/client.ts'
import { CryptoServiceInterface } from '@/core/ports/crypto.interface.ts'
import { Setting } from '@/core/entities/setting.entity.ts'

export class PrismaSettingRepository implements SettingRepository {
    constructor(
        private readonly prisma: PrismaClient,
        private readonly crypto: CryptoServiceInterface
    ) {}

    async findByCategory(category: string): Promise<Setting[]> {
        const records = await this.prisma.setting.findMany({
            where: { category }
        })
    
        return records.map(r => new Setting({
            id: r.id,
            key: r.key,
            value: r.isEncrypted ? this.crypto.decrypt(r.value) : r.value,
            type: r.type,
            category: r.category,
            isEncrypted: r.isEncrypted,
            updatedAt: r.updatedAt
        }))
    }

    async updateMany(settings: Setting[]): Promise<void> {
        await this.prisma.$transaction(
            settings.map(s => this.prisma.setting.upsert({
                where: { key_category: { key: s.key, category: s.category } },
                update: {
                    value: s.isEncrypted ? this.crypto.encrypt(s.value) : s.value,
                    type: s.type,
                    isEncrypted: s.isEncrypted,
                },
                create: {
                    key: s.key,
                    value: s.isEncrypted ? this.crypto.encrypt(s.value) : s.value,
                    type: s.type,
                    category: s.category,
                    isEncrypted: s.isEncrypted
                }
            }))
        )
    }

    async delete(key: string, category: string): Promise<void> {
        await this.prisma.setting.delete({
            where: { key_category: { key, category } }
        })
    }

    async deleteByCategory(category: string): Promise<void> {
        await this.prisma.setting.deleteMany({
            where: { category }
        })
    }
}