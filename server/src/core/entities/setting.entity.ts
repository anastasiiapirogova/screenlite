export type SettingProps = {
    id: string
    key: string
    value: string
    type: string
    category: string
    isEncrypted: boolean
    updatedAt: Date
}

export class Setting {
    constructor(
        private readonly props: SettingProps,
    ) {}
  
    get id(): string {
        return this.props.id
    }
  
    get key(): string {
        return this.props.key
    }
  
    get value(): string {
        return this.props.value
    }
  
    set value(newValue: string) {
        this.props.value = newValue
    }
  
    get type(): string {
        return this.props.type
    }
  
    get category(): string {
        return this.props.category
    }
  
    get isEncrypted(): boolean {
        return this.props.isEncrypted
    }
  
    get updatedAt(): Date {
        return this.props.updatedAt
    }
  
    toDTO(): SettingProps {
        return { ...this.props }
    }
}