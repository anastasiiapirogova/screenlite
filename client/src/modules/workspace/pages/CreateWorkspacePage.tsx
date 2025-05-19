import { Button } from '@shared/ui/buttons/Button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { createWorkspaceRequest, CreateWorkspaceRequestData } from '../api/requests/createWorkspaceRequest'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { workspaceQuery } from '../api/queries/workspaceQuery'
import { isAxiosError } from 'axios'
import { WorkspacePicture } from '@shared/components/WorkspacePicture'
import { InputLabelGroup } from '@shared/ui/input/InputLabelGroup'
import { Input } from '@shared/ui/input/Input'
import { InputError } from '@shared/ui/input/InputError'

export const CreateWorkspacePage = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

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
            console.log(workspace)
            await queryClient.setQueryData(workspaceQuery(workspace.slug).queryKey, workspace)
            navigate(`/workspaces/${workspace.slug}`)
        },
        onError: (error) => {
            if (isAxiosError(error) && error.response) {

                if (error.response.data && error.response.data.errors) {
				  const errors = error.response.data.errors
		
				  for (const [field, message] of Object.entries(errors)) {
                        const messageString = String(message)

                        setError(field as keyof CreateWorkspaceRequestData, {
                            type: 'custom',
                            message: messageString
                        })
				  }
                }
            }
        }
    })

    const onSubmit: SubmitHandler<CreateWorkspaceRequestData> = (data) => {
        mutate(data)
    }
	  
    return (
        <>
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
                                    affix={ 'screenlite.org/workspaces/' }
                                />
                            ) }
                        />
                        <InputError error={ errors.slug?.message }/>
                    </InputLabelGroup>
                </form>
            </div>
            <div>
                <Button
                    size='small'
                    className='w-full'
                    disabled={ isPending }
                    onClick={ () => handleSubmit(onSubmit)() }
                >
                    Create workspace
                </Button>
            </div>
        </>
		
    )
}
