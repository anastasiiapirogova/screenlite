import * as bcrypt from 'bcrypt'

export const hashPassword = (password: string) => {
    const rounds: number = 12

    return bcrypt.hash(password, rounds)
}