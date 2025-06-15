import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DialogDescription } from '@radix-ui/react-dialog'
import { useWorkspace } from '@/modules/workspace/hooks/useWorkspace'
import { useNavigate } from 'react-router'
import { useWorkspaceRoutes } from '@/modules/workspace/hooks/useWorkspaceRoutes'
import { CreatePlaylistLayoutRequestData } from '@modules/workspace/modules/playlistLayout/types.js'
import { createPlaylistLayoutRequest } from '@modules/workspace/modules/playlistLayout/api/requests/createPlaylistLayoutRequest.js'
import { playlistLayoutQuery } from '@modules/workspace/modules/playlistLayout/api/queries/playlistLayoutQuery.js'
import { Button } from '@shared/ui/buttons/Button'
import { ModalClose } from '@shared/ui/modal/Modal'
import { InputLabelGroup } from '@shared/ui/input/InputLabelGroup'
import { Input } from '@shared/ui/input/Input'
import { InputError } from '@shared/ui/input/InputError'
import { handleAxiosFieldErrors } from '@shared/helpers/handleAxiosFieldErrors'
import { useRefetchWorkspaceEntityCounts } from '@modules/workspace/hooks/useRefetchWorkspaceEntityCounts'

export const CreatePlaylistLayoutModal = () => {
    const workspace = useWorkspace()
    const routes = useWorkspaceRoutes()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const refetchEntityCounts = useRefetchWorkspaceEntityCounts()

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm<CreatePlaylistLayoutRequestData>({
        defaultValues: {
            name: '',
            workspaceId: workspace.id,
            resolutionHeight: 1080,
            resolutionWidth: 1920
        }
    })

    const { mutate, isPending } = useMutation({
        mutationFn: (data: CreatePlaylistLayoutRequestData) => createPlaylistLayoutRequest(data),
        onSuccess: async (playlistLayout) => {
            queryClient.setQueryData(playlistLayoutQuery(playlistLayout.id).queryKey, playlistLayout)
            refetchEntityCounts()
            navigate(routes.playlistLayout(playlistLayout.id))
        },
        onError: (error) => {
            handleAxiosFieldErrors<CreatePlaylistLayoutRequestData>(error, setError)
        }
    })

    const onSubmit: SubmitHandler<CreatePlaylistLayoutRequestData> = (data) => {
        mutate(data)
    }
	  
    return (
        <div className='px-7 flex flex-col gap-5 mt-5'>
            <div className='flex flex-col items-start gap-4'>
                <DialogDescription aria-description='Create playlist modal'/>
                <form
                    onSubmit={ handleSubmit(onSubmit) }
                    className='w-full flex flex-col gap-2'
                >
                    <InputLabelGroup
                        label='Layout name'
                        name='name'
                    >
                        <Controller
                            name='name'
                            control={ control }
                            render={ ({ field }) => (
                                <Input
                                    { ...field }
                                    autoComplete='off'
                                    placeholder='Enter a descriptive layout name'
                                />
                            ) }
                        />
                        <InputError error={ errors.name?.message }/>
                    </InputLabelGroup>
                </form>
            </div>
            <div className='flex gap-5 justify-end'>
                <ModalClose asChild>
                    <Button
                        color='secondary'
                        variant='soft'
                    >
                        Cancel
                    </Button>
                </ModalClose>
                <Button
                    disabled={ isPending }
                    onClick={ () => handleSubmit(onSubmit)() }
                >
                    Create layout
                </Button>
            </div>
        </div>
    )
}
