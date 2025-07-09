import { Input } from '@shared/ui/input/Input'
import { FullWidthSettingsPageHeader } from '../components/FullWidthSettingsPageHeader'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useCurrentUser } from '@modules/auth/hooks/useCurrentUser'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { currentUserQuery } from '@modules/auth/api/currentUser'
import { handleAxiosFieldErrors } from '@shared/helpers/handleAxiosFieldErrors'
import { InputLabelGroup } from '@shared/ui/input/InputLabelGroup'
import { InputError } from '@shared/ui/input/InputError'
import { Button } from '@shared/ui/buttons/Button'
import { ChangeEmailData, changeEmailRequest } from '../api/requests/changeEmailRequest'

export const ChangeEmailPage = () => {
    const user = useCurrentUser()
    const queryClient = useQueryClient()

    const {
        control,
        handleSubmit,
        setError,
        getValues,
        formState: { errors, isDirty },
        reset
    } = useForm<ChangeEmailData>({
        defaultValues: {
            userId: user.id,
            email: user.email,
        }
    })

    const { mutate, isPending } = useMutation({
        mutationFn: (data: ChangeEmailData) => changeEmailRequest(data),
        onSuccess: async (screen) => {
            queryClient.setQueryData(currentUserQuery().queryKey, screen)
            reset(getValues())
        },
        onError: (error) => {
            handleAxiosFieldErrors<ChangeEmailData>(error, setError)
        }
    })

    const onSubmit: SubmitHandler<ChangeEmailData> = (data) => {
        mutate(data)
    }

    return (
        <div>
            <FullWidthSettingsPageHeader backLink='/settings'>
                Change email
            </FullWidthSettingsPageHeader>
            <div className='max-w-screen-sm mx-auto p-5'>
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
                                    type='email'
                                />
                            ) }
                        />
                        <InputError error={ errors.email?.message }/>
                    </InputLabelGroup>
                    <div className='flex justify-end items-center gap-2 mt-5'>
                        <Button
                            to='/settings'
                            color='secondary'
                            variant='soft'
                            type="button"
                        >
                            Cancel
                        </Button>
                        <Button
                            type='submit'
                            disabled={ isPending || isDirty === false }
                            variant='solid'
                        >
                            Save
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
