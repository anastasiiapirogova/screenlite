import { Setting } from '@/core/entities/setting.entity.ts'
import { SafeDTO } from '@/shared/types/safe-dto.type.ts'
import { IEncryptionService } from '@/core/ports/encryption-service.interface.ts'

export abstract class SettingGroup<T> {
    abstract readonly category: string
    abstract readonly defaultValues: T

    constructor(private readonly encryption: IEncryptionService) {}

    toSettings(config: Partial<T>): Setting[] {
        return Object.entries(config).map(([key, value]) => {
            const isEncrypted = this.isEncrypted(key)
            const stringValue = String(value)
            const encryptedValue = isEncrypted
                ? this.encryption.encrypt(stringValue)
                : stringValue

            return new Setting({
                id: '',
                key,
                value: encryptedValue,
                type: this.getType(key),
                category: this.category,
                isEncrypted,
                updatedAt: new Date()
            })
        })
    }

    fromSettings(settings: Setting[]): T {
        return settings.reduce((config, setting) => {
            const decryptedValue = setting.isEncrypted
                ? this.encryption.decrypt(setting.value)
                : setting.value

            return {
                ...config,
                [setting.key]: this.parseValue(setting.type, decryptedValue)
            }
        }, this.defaultValues)
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

    private parseValue(type: string, value: string): string | number | boolean {
        switch (type) {
            case 'number': return Number(value)
            case 'boolean': return value === 'true'
            default: return value
        }
    }

    protected abstract getType(key: string): string
    protected abstract isEncrypted(key: string): boolean
}
