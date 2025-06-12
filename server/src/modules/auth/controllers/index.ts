import { login } from '@modules/auth/controllers/login.js'
import { signup } from '@modules/auth/controllers/signup.js'
import { logout } from '@modules/auth/controllers/logout.js'
import { me } from '@modules/auth/controllers/me.js'

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