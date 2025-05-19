import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { TbChevronRight } from 'react-icons/tb'
import { Link } from 'react-router'
import { useMutation } from '@tanstack/react-query'
import { useAuth } from '../../hooks/useAuth'
import { isAxiosError } from 'axios'
import { usePasswordStrength } from '@shared/hooks/usePasswordStrength'
import { signupRequest, SignupRequestData } from '@modules/auth/api/requests/signupRequest'
import { InputLabelGroup } from '@shared/ui/input/InputLabelGroup'
import { Input } from '@shared/ui/input/Input'
import { InputError } from '@shared/ui/input/InputError'
import { PasswordStrengthBar } from '@shared/utils/password/PasswordStrengthBar'
import { PasswordRuleCheck } from '@shared/utils/password/PasswordRuleCheck'
import { Button } from '@shared/ui/buttons/Button'
import { ButtonSpinner } from '@shared/ui/buttons/ButtonSpinner'

export const SignupForm = () => {
    const auth = useAuth()

    const {
        control,
        handleSubmit,
        watch,
        setError,
        formState: { errors }
    } = useForm<SignupRequestData>({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    })

    const { strength, hasLower, hasUpper, hasNumber, hasSpecial, hasSufficientLength } = usePasswordStrength(watch().password)

    const { mutate, isPending } = useMutation({
        mutationFn: (data: SignupRequestData) => signupRequest(data),
        onSuccess: (response) => {
            auth.onLogin(response)
        },
        onError: (error) => {
            if (isAxiosError(error) && error.response) {

                if (error.response.data && error.response.data.errors) {
				  const errors = error.response.data.errors
		
				  for (const [field, message] of Object.entries(errors)) {
                        const messageString = String(message)

                        setError(field as keyof SignupRequestData, {
                            type: 'custom',
                            message: messageString
                        })
				  }
                }
            }
        }
    })

    const onSubmit: SubmitHandler<SignupRequestData> = (data) => mutate(data)

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
        <div className='w-full flex flex-col max-w-xl bg-white p-20 rounded-3xl gap-10'>
            <h1 className='text-3xl font-semibold'>
                Sign up to Screenlite
            </h1>
            <form
                onSubmit={ handleSubmit(onSubmit) }
                className='w-full flex flex-col gap-3'
            >
                <InputLabelGroup
                    label='Name'
                    name='name'
                >
                    <Controller
                        name='name'
                        control={ control }
                        render={ ({ field }) => (
                            <Input
                                { ...field }
                                placeholder='John Doe'
                            />
                        ) }
                    />
                    <InputError error={ errors.name?.message }/>
                </InputLabelGroup>
                <InputLabelGroup
                    label='Email'
                    name='email'
                >
                    <Controller
                        name='email'
                        control={ control }
                        render={ ({ field }) => (
                            <Input
                                type='email'
                                { ...field }
                                placeholder='example@screenlite.org'
                            />
                        ) }
                    />
                    <InputError error={ errors.email?.message }/>
                </InputLabelGroup>
                <InputLabelGroup
                    label='Password'
                    name='password'
                >
                    <Controller
                        name='password'
                        control={ control }
                        render={ ({ field }) => (
                            <Input
                                type='password'
                                { ...field }
                                placeholder='Create a strong password'
                                autoComplete="new-password"
                            />
                        ) }
                    />
                    <InputError error={ errors.password?.message }/>
                </InputLabelGroup>
                <div className="mb-5">
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
                <Button
                    variant='solid'
                    className='w-full'
                    size='large'
                    disabled={ isPending }
                    icon={ isPending ? ButtonSpinner : TbChevronRight }
                    
                >
                    <span>Continue</span>
                </Button>
                <div className='mt-10 flex items-center justify-center gap-2'>
                    <span className='text-neutral-500'>
                        Already have an account?
                    </span>
                    <Link
                        to="/auth/login"
                        className='hover:text-primary transition-colors'
                    >
                        Login
                    </Link>
                </div>
            </form>
        </div>
    )
}
