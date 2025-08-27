import { Input } from '@shared/ui/input/Input'
import { FullWidthSettingsPageHeader } from '../components/FullWidthSettingsPageHeader'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { UpdateUserData, updateUserRequest } from '../api/requests/updateUserRequest'
import { useCurrentUser } from '@modules/auth/hooks/useCurrentUser'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { currentUserQuery } from '@modules/auth/api/currentUser'
import { handleAxiosFieldErrors } from '@shared/helpers/handleAxiosFieldErrors'
import { InputLabelGroup } from '@shared/ui/input/InputLabelGroup'
import { InputError } from '@shared/ui/input/InputError'
import { UserAvatarUploadComponent } from '@shared/components/UserAvatarUploadComponent'
import { Button } from '@shared/ui/buttons/Button'
import { CurrentUserData } from '@modules/auth/types'
import { User } from '../types'

export const EditProfilePage = () => {
    const user = useCurrentUser()
    const queryClient = useQueryClient()

    const {
        control,
        handleSubmit,
        setError,
        setValue,
        formState: { errors },
        watch
    } = useForm<UpdateUserData>({
        defaultValues: {
            userId: user.id,
            name: user.name,
            profilePhoto: null,
            removeProfilePhoto: false
        }
    })

    const nameChanged = watch('name') !== user.name
    const profilePhotoChanged = watch('profilePhoto') !== null
    const removeProfilePhoto = watch('removeProfilePhoto') === true && user.profilePhotoPath !== null

    const isDirty = nameChanged || profilePhotoChanged || removeProfilePhoto

    const { mutate, isPending } = useMutation({
        mutationFn: (data: UpdateUserData) => updateUserRequest(data),
        onSuccess: async (user: User) => {
            const data = queryClient.getQueryData<CurrentUserData>(currentUserQuery().queryKey)

            if (data) {
                queryClient.setQueryData(currentUserQuery().queryKey, {
                    ...data,
                    user: {
                        ...data.user,
                        name: user.name,
                        profilePhotoPath: user.profilePhotoPath || null
                    }
                })
            }

            setValue('profilePhoto', null)
            setValue('removeProfilePhoto', false)

            queryClient.invalidateQueries({ queryKey: currentUserQuery().queryKey })
        },
        onError: (error) => {
            handleAxiosFieldErrors<UpdateUserData>(error, setError)
        }
    })

    const onSubmit: SubmitHandler<UpdateUserData> = (data) => {
        mutate(data)
    }

    return (
        <div>
            <FullWidthSettingsPageHeader backLink='/settings'>
                Profile information
            </FullWidthSettingsPageHeader>
            <div className='max-w-screen-sm mx-auto p-5'>
                <form
                    onSubmit={ handleSubmit(onSubmit) }
                    className='w-full flex flex-col gap-2'
                >
                    <div className='text-neutral-500'>
                        Profile photo
                    </div>
                    <UserAvatarUploadComponent
                        name={ watch().name! }
                        profilePhoto={ watch().removeProfilePhoto ? null : user.profilePhotoPath }
                        preview={ watch().profilePhoto }
                        onChange={ (file) => {
                            setValue('profilePhoto', file)
                        } }
                    />
                    <div className='flex flex-col gap-2 mb-5'>
                        <div className='text-sm text-gray-500'>
                            Supported formats: JPG, PNG. Max size: 5MB. Recommended size is 512x512 pixels.
                        </div>
                        { ((user.profilePhotoPath && !watch().removeProfilePhoto) || watch().profilePhoto) && (
                            <div className='flex items-center gap-2 mt-5'>
                                <Button
                                    type='button'
                                    variant='soft'
                                    color='secondary'
                                    className='text-sm'
                                    onClick={ () => {
                                        setValue('profilePhoto', null)
                                        setValue('removeProfilePhoto', true)
                                    } }
                                >
                                    Remove profile photo
                                </Button>
                            </div>
                        ) }
                    </div>
                    <InputError error={ errors.profilePhoto?.message }/>
                    <InputLabelGroup
                        label='Name'
                        name='name'
                    >
                        <Controller
                            name='name'
                            control={ control }
                            render={ ({ field }) => (
                                <Input { ...field }/>
                            ) }
                        />
                        <InputError error={ errors.name?.message }/>
                    </InputLabelGroup>
                    <FormActions
                        isPending={ isPending }
                        isDirty={ isDirty }
                    />
                </form>
            </div>
        </div>
    )
}


const FormActions = ({ isPending, isDirty }: { isPending: boolean, isDirty: boolean }) => {
    return (
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
    )
}