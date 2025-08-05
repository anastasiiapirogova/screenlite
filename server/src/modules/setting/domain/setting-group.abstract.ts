import { Setting } from '@/core/entities/setting.entity.ts'
import { IEncryptionService } from '@/core/ports/encryption-service.interface.ts'
import { SafeDTO } from '@/core/types/safe-dto.type.ts'

export abstract class SettingGroup<T> {
    abstract readonly category: string
    abstract readonly defaultValues: T

    constructor(private readonly encryption: IEncryptionService) {}

    async toSettings(config: Partial<T>): Promise<Setting[]> {
        const settings: Setting[] = []
        
        for (const [key, value] of Object.entries(config)) {
            const isEncrypted = this.isEncrypted(key)
            const stringValue = String(value)
            const encryptedValue = isEncrypted
                ? await this.encryption.encrypt(stringValue)
                : stringValue

            settings.push(new Setting({
                id: '',
                key,
                value: encryptedValue,
                type: this.getType(key),
                category: this.category,
                isEncrypted,
                updatedAt: new Date()
            }))
        }
        
        return settings
    }

    async fromSettings(settings: Setting[]): Promise<T> {
        let config = this.defaultValues
        
        for (const setting of settings) {
            const decryptedValue = setting.isEncrypted
                ? await this.encryption.decrypt(setting.value)
                : setting.value

            config = {
                ...config,
                [setting.key]: this.parseValue(setting.type, decryptedValue)
            }
        }
        
        return config
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
