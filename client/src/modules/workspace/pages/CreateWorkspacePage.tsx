import { Button } from '@shared/ui/buttons/Button'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { createWorkspaceRequest, CreateWorkspaceRequestData } from '../api/requests/createWorkspaceRequest'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { WorkspacePicture } from '@shared/components/WorkspacePicture'
import { InputLabelGroup } from '@shared/ui/input/InputLabelGroup'
import { Input } from '@shared/ui/input/Input'
import { InputError } from '@shared/ui/input/InputError'
import { handleAxiosFieldErrors } from '@shared/helpers/handleAxiosFieldErrors'
import { FullWidthSettingsPageHeader } from '@modules/user/components/FullWidthSettingsPageHeader'
import { BACKEND_URL } from '@config/screenlite'

export const CreateWorkspacePage = () => {
    const navigate = useNavigate()

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors },
        watch
    } = useForm<CreateWorkspaceRequestData>({
        defaultValues: {
            name: '',
            slug: ''
        }
    })

    const { mutate, isPending } = useMutation({
        mutationFn: (data: CreateWorkspaceRequestData) => createWorkspaceRequest(data),
        onSuccess: async (workspace) => {
            navigate(`/workspaces/${workspace.slug}`)
        },
        onError: (error) => {
            handleAxiosFieldErrors<CreateWorkspaceRequestData>(error, setError)
        }
    })

    const onSubmit: SubmitHandler<CreateWorkspaceRequestData> = (data) => {
        mutate(data)
    }

    const affix = `${BACKEND_URL.hostname}${BACKEND_URL.port ? ':' + BACKEND_URL.port : ''}${BACKEND_URL.pathname}workspaces/`

    return (
        <>
            <FullWidthSettingsPageHeader backLink='/workspaces'>
                Create workspace
            </FullWidthSettingsPageHeader>
            <div className='max-w-screen-sm mx-auto p-5'>
                <div className='flex flex-col items-start gap-4'>
                    <WorkspacePicture
                        name={ watch().name  }
                        size={ 64 }
                    />
                    <div className='flex flex-col gap-3 text-sm'>
                        <p>Workspaces help you organize and manage content and schedules for your screens.</p>
                        <p>You can also invite team members to collaborate, making it easier to update and manage your content together.</p>
                    </div>
                    <form
                        onSubmit={ handleSubmit(onSubmit) }
                        className='w-full flex flex-col gap-2'
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
                                        placeholder='Screenlite HQ'
                                    />
                                ) }
                            />
                            <InputError error={ errors.name?.message }/>
                        </InputLabelGroup>
                        <InputLabelGroup
                            label='Slug'
                            name='slug'
                        >
                            <Controller
                                name='slug'
                                control={ control }
                                render={ ({ field }) => (
                                    <Input
                                        { ...field }
                                        placeholder={ 'screenlite-hq' }
                                        affix={ affix }
                                    />
                                ) }
                            />
                            <InputError error={ errors.slug?.message }/>
                        </InputLabelGroup>
                    </form>
                </div>
                <div className='mt-5 flex justify-end items-center gap-2'>
                    <Button
                        disabled={ isPending }
                        onClick={ () => handleSubmit(onSubmit)() }
                    >
                        Create workspace
                    </Button>
                </div>
            </div>
        </>
		
    )
}
