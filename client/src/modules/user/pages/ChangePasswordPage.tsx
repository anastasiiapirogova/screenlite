import { Input } from '@shared/ui/input/Input'
import { FullWidthSettingsPageHeader } from '../components/FullWidthSettingsPageHeader'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useCurrentUser } from '@modules/auth/hooks/useCurrentUser'
import { useMutation } from '@tanstack/react-query'
import { handleAxiosFieldErrors } from '@shared/helpers/handleAxiosFieldErrors'
import { InputLabelGroup } from '@shared/ui/input/InputLabelGroup'
import { InputError } from '@shared/ui/input/InputError'
import { Button } from '@shared/ui/buttons/Button'
import { ChangePasswordData, changePasswordRequest } from '../api/requests/changePasswordRequest'

// TODO: Add success message
export const ChangePasswordPage = () => {
    const user = useCurrentUser()

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isDirty },
        reset,
    } = useForm<ChangePasswordData>({
        defaultValues: {
            userId: user.id,
            currentPassword: '',
            newPassword: ''
        }
    })

    const { mutate, isPending } = useMutation({
        mutationFn: (data: ChangePasswordData) => changePasswordRequest(data),
        onSuccess: async () => {
            reset()
        },
        onError: (error) => {
            handleAxiosFieldErrors<ChangePasswordData>(error, setError)
        }
    })

    const onSubmit: SubmitHandler<ChangePasswordData> = (data) => {
        mutate(data)
    }

    return (
        <div>
            <FullWidthSettingsPageHeader backLink='/security'>
                Change password
            </FullWidthSettingsPageHeader>
            <div className='max-w-screen-sm mx-auto p-5'>
                <div className='mb-5'>
                    After updating your password, all other sessions will be logged out except the current one.
                </div>
                <form
                    onSubmit={ handleSubmit(onSubmit) }
                    className='w-full flex flex-col gap-2'
                >
                    <InputLabelGroup
                        label='Current password'
                        name='currentPassword'
                    >
                        <Controller
                            name='currentPassword'
                            control={ control }
                            render={ ({ field }) => (
                                <Input
                                    { ...field }
                                    type='password'
                                />
                            ) }
                        />
                        <InputError error={ errors.currentPassword?.message }/>
                    </InputLabelGroup>

                    <InputLabelGroup
                        label='New password'
                        name='newPassword'
                    >
                        <Controller
                            name='newPassword'
                            control={ control }
                            render={ ({ field }) => (
                                <Input
                                    { ...field }
                                    type='password'
                                />
                            ) }
                        />
                        <InputError error={ errors.newPassword?.message }/>
                    </InputLabelGroup>

                    <div className='flex justify-end items-center gap-2 mt-5'>
                        <Button
                            to='/security'
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
                            Change
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
