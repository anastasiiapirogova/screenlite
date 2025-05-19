import { isAxiosError } from 'axios'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handleAxiosFieldErrors<T extends Record<string, any>>(
    error: unknown,
    setError: (field: keyof T, error: { type: string; message: string }) => void
): boolean {
    if (!isAxiosError(error) || !error.response?.data?.errors) {
        return false
    }

    const errors = error.response.data.errors
    
    for (const [field, message] of Object.entries(errors)) {
        const messageString = String(message)

        setError(field as keyof T, {
            type: 'custom',
            message: messageString
        })
    }

    return true
}