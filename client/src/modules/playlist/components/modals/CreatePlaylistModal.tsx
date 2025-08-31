import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { DialogDescription } from '@radix-ui/react-dialog'
import { useWorkspace } from '@/modules/workspace/hooks/useWorkspace'
import { useNavigate } from 'react-router'
import { useWorkspaceRoutes } from '@/modules/workspace/hooks/useWorkspaceRoutes'
import { CreatePlaylistRequestData } from '../../types'
import { createPlaylistRequest } from '../../api/requests/createPlaylistRequest'
import { useSetPlaylistQueryData } from '@modules/playlist/hooks/useSetPlaylistQueryData'
import { InputLabelGroup } from '@shared/ui/input/InputLabelGroup'
import { Input } from '@shared/ui/input/Input'
import { InputError } from '@shared/ui/input/InputError'
import { Button } from '@shared/ui/buttons/Button'
import { ModalClose } from '@shared/ui/modal/Modal'
import { getPlaylistTypeOptions } from '@modules/playlist/utils/playlistTypes'
import { RadioGroup } from '@shared/ui/radio/RadioGroup'
import { handleAxiosFieldErrors } from '@shared/helpers/handleAxiosFieldErrors'
import { useRefetchWorkspaceStatistics } from '@modules/workspace/hooks/useRefetchWorkspaceStatistics'

export const CreatePlaylistModal = () => {
    const workspace = useWorkspace()
    const routes = useWorkspaceRoutes()
    const navigate = useNavigate()  
    const setPlaylistQueryData = useSetPlaylistQueryData()
    const refetchStatistics = useRefetchWorkspaceStatistics()

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
            refetchStatistics()
            navigate(routes.playlist(playlist.id))
        },
        onError: (error) => {
            handleAxiosFieldErrors<CreatePlaylistRequestData>(error, setError)
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
                                    autoComplete='off'
                                    placeholder='Enter a descriptive playlist name'
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
