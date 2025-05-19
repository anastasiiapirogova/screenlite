import axios from '../../../../config/axios'

export const logoutRequest = async () => {
    await axios.post('auth/logout')
}
