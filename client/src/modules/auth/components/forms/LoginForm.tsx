import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { InputLabelGroup } from '@shared/ui/input/InputLabelGroup'
import { loginRequest, LoginRequestData } from '../../api/login'
import { useMutation } from '@tanstack/react-query'
import { InputError } from '@shared/ui/input/InputError'
import { useAuth } from '../../hooks/useAuth'
import { Link } from 'react-router'
import { Input } from '@shared/ui/input/Input'
import { Button } from '@shared/ui/buttons/Button'
import { handleAxiosFieldErrors } from '@shared/helpers/handleAxiosFieldErrors'

export const LoginForm = () => {
    const auth = useAuth()

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm<LoginRequestData>({
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const { mutate, isPending } = useMutation({
        mutationFn: (data: LoginRequestData) => loginRequest(data),
        onSuccess: (response) => {
            auth.onLogin(response)
        },
        onError: (error) => {
            handleAxiosFieldErrors<LoginRequestData>(error, setError)
        }
    })

    const onSubmit: SubmitHandler<LoginRequestData> = (data) => {
        mutate(data)
    }
	  
    return (
        <div className='w-full flex flex-col max-w-xl bg-white p-20 rounded-3xl gap-10'>
            <h1 className='text-3xl font-semibold'>
                Login
            </h1>
            <form
                onSubmit={ handleSubmit(onSubmit) }
                className='w-full flex flex-col gap-2'
            >
                <InputLabelGroup
                    label='Email'
                    name='email'
                >
                    <Controller
                        name='email'
                        control={ control }
                        render={ ({ field }) => (
                            <Input
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
                                type="password"
                                placeholder='Enter your password'
                                { ...field }
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
                        Don't have an account?
                    </span>
                    <Link
                        to="/auth/signup"
                        className='hover:text-primary transition-colors'
                    >
                        Sign up
                    </Link>
                </div>
            </form>
        </div>
    )
}
