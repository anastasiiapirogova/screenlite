import { Setting } from '@/core/entities/setting.entity.ts'

export type SettingRepository = {
    findByCategory(category: string): Promise<Setting[]>
    updateMany(settings: Setting[]): Promise<void>
    delete(key: string, category: string): Promise<void>
    deleteByCategory(category: string): Promise<void>
}