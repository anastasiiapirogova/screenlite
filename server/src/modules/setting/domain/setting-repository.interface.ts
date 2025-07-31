import { Setting } from '@/core/entities/setting.entity.ts'

export type ISettingRepository = {
    findByCategory(category: string): Promise<Setting[]>
    saveMany(settings: Setting[]): Promise<void>
    delete(key: string, category: string): Promise<void>
    deleteByCategory(category: string): Promise<void>
}