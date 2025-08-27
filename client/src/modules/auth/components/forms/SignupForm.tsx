import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { Link } from 'react-router'
import { useMutation } from '@tanstack/react-query'
import { useAuth } from '../../hooks/useAuth'
import { signupRequest, SignupRequestData } from '@modules/auth/api/signup'
import { InputLabelGroup } from '@shared/ui/input/InputLabelGroup'
import { Input } from '@shared/ui/input/Input'
import { InputError } from '@shared/ui/input/InputError'
import { Button } from '@shared/ui/buttons/Button'
import { handleAxiosFieldErrors } from '@shared/helpers/handleAxiosFieldErrors'

export const SignupForm = () => {
    const auth = useAuth()

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm<SignupRequestData>({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    })


    const { mutate, isPending } = useMutation({
        mutationFn: (data: SignupRequestData) => signupRequest(data),
        onSuccess: (response) => {
            auth.onLogin(response)
        },
        onError: (error) => {
            handleAxiosFieldErrors<SignupRequestData>(error, setError)
        }
    })

    const onSubmit: SubmitHandler<SignupRequestData> = (data) => mutate(data)

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
                <Button
                    variant='solid'
                    className='mt-5 rounded-md'
                    size='large'
                    disabled={ isPending }
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
