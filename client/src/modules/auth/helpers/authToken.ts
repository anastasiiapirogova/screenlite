const KEY = 'authToken'

export const storeAuthToken = (authToken: string) => {
    localStorage.setItem(KEY, authToken)
}

export const getAuthToken = () => {
    return localStorage.getItem(KEY)
}

export const removeAuthToken = () => {
    localStorage.removeItem(KEY)
}