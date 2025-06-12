import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { DialogDescription } from '@radix-ui/react-dialog'
import { useWorkspace } from '@/modules/workspace/hooks/useWorkspace'
import { useNavigate } from 'react-router'
import { useWorkspaceRoutes } from '@/modules/workspace/hooks/useWorkspaceRoutes'
import { CreatePlaylistRequestData } from '../../types'
import { createPlaylistRequest } from '../../api/requests/createPlaylistRequest'
import { useSetPlaylistQueryData } from '@modules/workspace/modules/playlist/hooks/useSetPlaylistQueryData'
import { InputLabelGroup } from '@shared/ui/input/InputLabelGroup'
import { Input } from '@shared/ui/input/Input'
import { InputError } from '@shared/ui/input/InputError'
import { Button } from '@shared/ui/buttons/Button'
import { ModalClose } from '@shared/ui/modal/Modal'
import { getPlaylistTypeOptions } from '@modules/workspace/modules/playlist/utils/playlistTypes'
import { RadioGroup } from '@shared/ui/radio/RadioGroup'

export const CreatePlaylistModal = () => {
    const workspace = useWorkspace()
    const routes = useWorkspaceRoutes()
    const navigate = useNavigate()
    const setPlaylistQueryData = useSetPlaylistQueryData()

    const {
        control,
        handleSubmit,
        setError,
        setValue,
        watch,
        formState: { errors }
    } = useForm<CreatePlaylistRequestData>({
        defaultValues: {
            name: '',
            type: 'standard',
            workspaceId: workspace.id
        }
    })

    const { mutate, isPending } = useMutation({
        mutationFn: (data: CreatePlaylistRequestData) => createPlaylistRequest(data),
        onSuccess: async (playlist) => {
            setPlaylistQueryData(playlist.id, playlist)
            navigate(routes.playlist(playlist.id))
        },
        onError: (error) => {
            if (isAxiosError(error) && error.response) {

                if (error.response.data && error.response.data.errors) {
				  const errors = error.response.data.errors
		
				  for (const [field, message] of Object.entries(errors)) {
                        const messageString = String(message)

                        setError(field as keyof CreatePlaylistRequestData, {
                            type: 'custom',
                            message: messageString
                        })
				  }
                }
            }
        }
    })

    const onSubmit: SubmitHandler<CreatePlaylistRequestData> = (data) => {
        mutate(data)
    }
	  
    return (
        <div className='px-7 flex flex-col gap-5'>
            <div className='flex flex-col items-start gap-4'>
                <DialogDescription aria-description='Create playlist modal'/>
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
                                    placeholder='Breakfasts'
                                />
                            ) }
                        />
                        <InputError error={ errors.name?.message }/>
                    </InputLabelGroup>
                    <InputLabelGroup
                        label='Type'
                        name='type'
                    >
                        <RadioGroup
                            ariaLabel='Playlist type'
                            value={ watch().type }
                            options={ getPlaylistTypeOptions() }
                            onChange={ (value) => setValue('type', value) }
                        />
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
                    Create playlist
                </Button>
            </div>
        </div>
    )
}
