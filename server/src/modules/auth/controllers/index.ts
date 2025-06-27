import { login } from '@/modules/auth/controllers/login.ts'
import { signup } from '@/modules/auth/controllers/signup.ts'
import { logout } from '@/modules/auth/controllers/logout.ts'
import { me } from '@/modules/auth/controllers/me.ts'

export {
    login,
    signup,
    logout,
    me
}

export default {
    login,
    signup,
    logout,
    me
}