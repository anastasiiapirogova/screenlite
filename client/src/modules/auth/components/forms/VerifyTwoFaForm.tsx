import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { InputLabelGroup } from '../../../../shared/ui/input/InputLabelGroup'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InputError } from '../../../../shared/ui/input/InputError'
import { TbChevronRight } from 'react-icons/tb'
import { ButtonSpinner } from '@shared/ui/buttons/ButtonSpinner'
import { Input } from '@shared/ui/input/Input'
import { Button } from '@shared/ui/buttons/Button'
import { VerifyTwoFaData, verifyTwoFaRequest } from '@modules/user/api/requests/verifyTwoFaRequest'
import { currentUserQuery } from '@modules/auth/api/queries/currentUser'
import { handleAxiosFieldErrors } from '@shared/helpers/handleAxiosFieldErrors'

export const VerifyTwoFaForm = () => {
    const queryClient = useQueryClient()

    const {
        control,
        setError,
        handleSubmit,
        formState: { errors }
    } = useForm<VerifyTwoFaData>({
        defaultValues: {
            token: ''
        }
    })

    const { mutate, isPending } = useMutation({
        mutationFn: (data: VerifyTwoFaData) => verifyTwoFaRequest(data),
        onSuccess: (user) => {
            queryClient.setQueryData(currentUserQuery().queryKey, user)
        },
        onError: (error) => {
            handleAxiosFieldErrors<VerifyTwoFaData>(error, setError)
        }
    })

    const onSubmit: SubmitHandler<VerifyTwoFaData> = (data) => {
        mutate(data)
    }
	  
    return (
        <div className='w-full max-w-[300px]'>
            <form
                onSubmit={ handleSubmit(onSubmit) }
                className='w-full flex flex-col gap-2'
            >
                <InputLabelGroup
                    label='Token'
                    name='token'
                >
                    <Controller
                        name='token'
                        control={ control }
                        render={ ({ field }) => (
                            <Input { ...field }/>
                        ) }
                    />
                    <InputError error={ errors.token?.message }/>
                </InputLabelGroup>
                <Button
                    variant='solid'
                    className='w-full mt-5'
                    size='large'
                    disabled={ isPending }
                    icon={ isPending ? ButtonSpinner : TbChevronRight }
                    iconPosition='right'
                >
                    <span>Continue</span>
                </Button>
            </form>
        </div>
    )
}
