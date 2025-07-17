type SecretKeys = 'password'

export type SafeDTO<T> = {
    [K in keyof T]: K extends SecretKeys ? null : T[K]
}