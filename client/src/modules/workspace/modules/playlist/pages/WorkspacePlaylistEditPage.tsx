import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useSetPlaylistQueryData } from '@modules/workspace/modules/playlist/hooks/useSetPlaylistQueryData'
import { InputLabelGroup } from '@shared/ui/input/InputLabelGroup'
import { Input } from '@shared/ui/input/Input'
import { InputError } from '@shared/ui/input/InputError'
import { Button } from '@shared/ui/buttons/Button'
import { usePlaylist } from '@modules/workspace/modules/playlist/hooks/usePlaylist'
import { updatePlaylistRequest, UpdatePlaylistRequestData } from '@modules/workspace/modules/playlist/api/requests/updatePlaylistRequest'
import { Textarea } from '@shared/ui/input/Textarea'

export const WorkspacePlaylistEditPage = () => {
    const playlist = usePlaylist()
    const setPlaylistQueryData = useSetPlaylistQueryData()

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm<UpdatePlaylistRequestData>({
        defaultValues: {
            name: playlist.name,
            description: playlist.description,
            playlistId: playlist.id
        }
    })

    const { mutate, isPending } = useMutation({
        mutationFn: (data: UpdatePlaylistRequestData) => updatePlaylistRequest(data),
        onSuccess: async (playlist) => {
            setPlaylistQueryData(playlist.id, playlist)
        },
        onError: (error) => {
            if (isAxiosError(error) && error.response) {

                if (error.response.data && error.response.data.errors) {
				  const errors = error.response.data.errors
		
				  for (const [field, message] of Object.entries(errors)) {
                        const messageString = String(message)

                        setError(field as keyof UpdatePlaylistRequestData, {
                            type: 'custom',
                            message: messageString
                        })
				  }
                }
            }
        }
    })

    const onSubmit: SubmitHandler<UpdatePlaylistRequestData> = (data) => {
        mutate(data)
    }

    return (
        <div className='flex flex-col gap-5 mt-5 px-7'>
            <div className='flex flex-col items-start gap-4'>
                <form
                    onSubmit={ handleSubmit(onSubmit) }
                    className='w-full flex flex-col gap-2 max-h-[300px] overflow-y-auto'
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
                        label='Description'
                        name='description'
                    >
                        <Controller
                            name='description'
                            control={ control }
                            render={ ({ field }) => (
                                <Textarea
                                    rows={ 10 }
                                    { ...field }
                                    placeholder='Optional'
                                    className='resize-none h-[150px]'
                                    style={ { scrollbarGutter: 'stable' } }
                                />
                            ) }
                        />
                        <InputError error={ errors.description?.message }/>
                    </InputLabelGroup>
                </form>
            </div>
            <div className='flex gap-4 justify-end'>
                <Button
                    color='secondary'
                    variant='soft'
                >
                    Cancel
                </Button>
                <Button
                    disabled={ isPending }
                    onClick={ () => handleSubmit(onSubmit)() }
                >
                    Save
                </Button>
            </div>
        </div>
    )
}
