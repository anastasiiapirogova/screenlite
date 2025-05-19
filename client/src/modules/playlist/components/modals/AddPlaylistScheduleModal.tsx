import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { Button } from '../../../../shared/ui/buttons/Button'
import { DialogDescription } from '@radix-ui/react-dialog'
import { CreatePlaylistScheduleRequestData } from '../../types'
import { playlistQuery } from '../../api/queries/playlistQuery'
import { createPlaylistScheduleRequest } from '../../api/requests/createPlaylistScheduleRequest'
import { usePlaylist } from '../../hooks/usePlaylist'
import { InputLabelGroup } from '@shared/ui/input/InputLabelGroup'
import { InputError } from '@shared/ui/input/InputError'
import { ModalClose } from '@shared/ui/modal/Modal'
import { Input } from '@shared/ui/input/Input'

type Props = {
	onClose: () => void
}

export const AddPlaylistScheduleModal = ({ onClose }: Props) => {
    const playlist = usePlaylist()
    const queryClient = useQueryClient()
    const currentPlaylistQuery = playlistQuery(playlist.id)

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm<CreatePlaylistScheduleRequestData>({
        defaultValues: {
            endAt: '',
            endTime: '11:02',
            playlistId: playlist.id,
            startAt: '2018-08-17T14:00:00.000Z',
            startTime: '11:10',
            weekdays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
        }
    })

    const { mutate, isPending } = useMutation({
        mutationFn: (data: CreatePlaylistScheduleRequestData) => createPlaylistScheduleRequest(data),
        onSuccess: async (schedules) => {
            queryClient.setQueryData(currentPlaylistQuery.queryKey, (oldData: Screen) => {
                if (!oldData) return oldData
							
                return {
                    ...oldData,
                    schedules
                }
            })
            onClose()
        },
        onError: (error) => {
            if (isAxiosError(error) && error.response) {

                if (error.response.data && error.response.data.errors) {
				  const errors = error.response.data.errors
		
				  for (const [field, message] of Object.entries(errors)) {
                        const messageString = String(message)

                        setError(field as keyof CreatePlaylistScheduleRequestData, {
                            type: 'custom',
                            message: messageString
                        })
				  }
                }
            }
        }
    })

    const onSubmit: SubmitHandler<CreatePlaylistScheduleRequestData> = (data) => {
        const { startAt, endAt, startTime, endTime } = data

        mutate({
            ...data,
            startAt: startAt,
            endAt: endAt || null,
            startTime: startTime || null,
            endTime: endTime || null
        })
    }
	  
    return (
        <>
            <div className='flex flex-col items-start gap-4'>
                <DialogDescription aria-description='Create playlist schedule modal'/>
                <form
                    onSubmit={ handleSubmit(onSubmit) }
                    className='w-full flex flex-col gap-2'
                >
                    <InputLabelGroup
                        label='Playlist name'
                        name='name'
                    >
                        <Controller
                            name='startAt'
                            control={ control }
                            render={ ({ field }) => (
                                <Input
                                    { ...field }
                                    value={ field.value ?? '' }
                                    placeholder='Breakfasts'
                                />
                            ) }
                        />
                        <InputError error={ errors.startAt?.message }/>
                    </InputLabelGroup>
                    <InputLabelGroup
                        label='Playlist name'
                        name='name'
                    >
                        <Controller
                            name='endAt'
                            control={ control }
                            render={ ({ field }) => (
                                <Input
                                    { ...field }
                                    value={ field.value ?? '' }
                                    placeholder='Breakfasts'
                                />
                            ) }
                        />
                        <InputError error={ errors.endAt?.message }/>
                    </InputLabelGroup>
                    <InputLabelGroup
                        label='Playlist name'
                        name='name'
                    >
                        <Controller
                            name='startTime'
                            control={ control }
                            render={ ({ field }) => (
                                <Input
                                    { ...field }
                                    value={ field.value ?? '' }
                                    placeholder='Breakfasts'
                                />
                            ) }
                        />
                        <InputError error={ errors.startTime?.message }/>
                    </InputLabelGroup>
                    <InputLabelGroup
                        label='Playlist name'
                        name='name'
                    >
                        <Controller
                            name='endTime'
                            control={ control }
                            render={ ({ field }) => (
                                <Input
                                    { ...field }
                                    value={ field.value ?? '' }
                                    placeholder='Breakfasts'
                                />
                            ) }
                        />
                        <InputError error={ errors.endTime?.message }/>
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
                    Create schedule
                </Button>
            </div>
        </>
		
    )
}
