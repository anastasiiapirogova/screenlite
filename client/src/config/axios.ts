import axiosDefault from 'axios'
import { getAuthToken } from '../modules/auth/helpers/authToken'

const API_URL = new URL('api/', import.meta.env.VITE_API_URL).toString()

const axios = axiosDefault.create({
    baseURL: API_URL
})

axios.interceptors.request.use(
    (config) => {
        const token = getAuthToken()

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
		
        return config
    },
    (error) => {
        Promise.reject(error)
    }
)

export default axios