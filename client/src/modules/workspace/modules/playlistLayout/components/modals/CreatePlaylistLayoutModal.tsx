import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
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

export const CreatePlaylistLayoutModal = () => {
    const workspace = useWorkspace()

    const routes = useWorkspaceRoutes()

    const navigate = useNavigate()

    const queryClient = useQueryClient()

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
            await queryClient.setQueryData(playlistLayoutQuery(playlistLayout.id).queryKey, playlistLayout)
            navigate(routes.playlistLayout(playlistLayout.id))
        },
        onError: (error) => {
            if (isAxiosError(error) && error.response) {

                if (error.response.data && error.response.data.errors) {
				  const errors = error.response.data.errors
		
				  for (const [field, message] of Object.entries(errors)) {
                        const messageString = String(message)

                        setError(field as keyof CreatePlaylistLayoutRequestData, {
                            type: 'custom',
                            message: messageString
                        })
				  }
                }
            }
        }
    })

    const onSubmit: SubmitHandler<CreatePlaylistLayoutRequestData> = (data) => {
        mutate(data)
    }
	  
    return (
        <>
            <div className='flex flex-col items-start gap-4'>
                <DialogDescription aria-description='Create playlist modal'/>
                <form
                    onSubmit={ handleSubmit(onSubmit) }
                    className='w-full flex flex-col gap-2'
                >
                    <InputLabelGroup
                        label='Playlist name'
                        name='name'
                    >
                        <Controller
                            name='name'
                            control={ control }
                            render={ ({ field }) => (
                                <Input
                                    { ...field }
                                    placeholder='Breakfasts'
                                />
                            ) }
                        />
                        <InputError error={ errors.name?.message }/>
                    </InputLabelGroup>
                </form>
            </div>
            <div>
                <ModalClose asChild>
                    <Button
                        size='small'
                        className='w-full'
                    >
                        Cancel
                    </Button>
                </ModalClose>
                <Button
                    size='small'
                    className='w-full'
                    disabled={ isPending }
                    onClick={ () => handleSubmit(onSubmit)() }
                >
                    Create layout
                </Button>
            </div>
        </>
		
    )
}
