import { isAxiosError } from 'axios'

export const isAxiosStatusCode = (error: unknown, statusCode: number) => {
    return isAxiosError(error) && error.response?.status === statusCode
}