import { Setting } from '@/core/entities/setting.entity.ts'
import { SafeDTO } from '@/shared/types/safe-dto.type.ts'

export abstract class SettingGroup<T> {
    abstract readonly category: string
    abstract readonly defaultValues: T

    toSettings(config: Partial<T>): Setting[] {
        return Object.entries(config).map(([key, value]) => 
            new Setting({
                id: '',
                key,
                value: String(value),
                type: this.getType(key),
                category: this.category,
                isEncrypted: this.isEncrypted(key),
                updatedAt: new Date()
            })
        )
    }

    fromSettings(settings: Setting[]): T {
        return settings.reduce((config, setting) => ({
            ...config,
            [setting.key]: this.parseValue(setting)
        }), this.defaultValues)
    }

    toSafeDTO(fullConfig: T): SafeDTO<T> {
        const result: Partial<SafeDTO<T>> = { ...(fullConfig as SafeDTO<T>) }

        for (const key of Object.keys(fullConfig as object) as (keyof T)[]) {
            if (this.isEncrypted(key as string)) {
                result[key] = null as SafeDTO<T>[typeof key]
            }
        }
        return result as SafeDTO<T>
    }

    private parseValue(setting: Setting): string | number | boolean {
        switch (setting.type) {
            case 'number': return Number(setting.value)
            case 'boolean': return setting.value === 'true'
            default: return setting.value
        }
    }

    protected abstract getType(key: string): string
    protected abstract isEncrypted(key: string): boolean
}