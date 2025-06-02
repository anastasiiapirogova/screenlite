import { usePasswordStrength } from '@shared/hooks/usePasswordStrength'
import { PasswordStrengthBar } from './PasswordStrengthBar'
import { PasswordRuleCheck } from './PasswordRuleCheck'

export const PasswordStrength = ({ password }: { password: string }) => {
    const { strength, hasLower, hasUpper, hasNumber, hasSpecial, hasSufficientLength } = usePasswordStrength(password)

    const passwordRules = [
        {
            condition: hasSufficientLength,
            message: '8 characters minimum'
        },
        {
            condition: hasUpper,
            message: 'an uppercase letter'
        },
        {
            condition: hasLower,
            message: 'a lowercase letter'
        },
        {
            condition: hasNumber,
            message: 'a number'
        },
        {
            condition: hasSpecial,
            message: 'a symbol'
        }
    ]

    return (
        <div>
            <PasswordStrengthBar strength={ strength } />
			
            <div className="mt-4 text-sm text-neutral-600">
                <div>
                    Your password must contain at least:
                </div> 
                {
                    passwordRules.map(({ condition, message }) => (
                        <PasswordRuleCheck
                            key={ message }
                            condition={ condition }
                            message={ message }
                        />
                    ))
                }
            </div>
        </div>
    )
}
