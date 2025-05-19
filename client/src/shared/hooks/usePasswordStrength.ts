import { useState, useEffect } from 'react'

type PasswordStrength = {
	strength: number
	satisfiedRules: number
	hasLower: boolean
	hasUpper: boolean
	hasNumber: boolean
	hasSpecial: boolean
	isSecure: boolean
	hasSufficientLength: boolean
};

export const usePasswordStrength = (password: string): PasswordStrength => {
    const [strength, setStrength] = useState<PasswordStrength>({
        strength: 0,
        satisfiedRules: 0,
        hasLower: false,
        hasUpper: false,
        hasNumber: false,
        hasSpecial: false,
        isSecure: false,
        hasSufficientLength: false,
    })

    useEffect(() => {
        const length = password.length
        const hasLower = /[\p{Ll}]/u.test(password)
        const hasUpper = /[\p{Lu}]/u.test(password)
        const hasNumber = /\p{N}/u.test(password)
        const hasSpecial = /[^\p{L}\p{N}]/u.test(password)

        const hasSufficientLength = length >= 8

        const satisfiedRules = [
            hasSufficientLength,
            hasUpper,
            hasLower,
            hasNumber,
            hasSpecial,
        ].filter(Boolean).length

        const isSecure = satisfiedRules === 5

        setStrength({
            strength: Math.min(satisfiedRules, 5),
            satisfiedRules,
            hasLower,
            hasUpper,
            hasNumber,
            hasSpecial,
            isSecure,
            hasSufficientLength,
        })
    }, [password])

    return strength
}
