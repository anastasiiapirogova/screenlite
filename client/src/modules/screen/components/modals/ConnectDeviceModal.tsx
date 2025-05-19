import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { InputError } from '../../../../shared/ui/input/InputError'
import { Button } from '../../../../shared/ui/buttons/Button'
import { DialogDescription } from '@radix-ui/react-dialog'
import { ConnectDeviceRequestData, Screen } from '../../types'
import { useScreen } from '../../hooks/useScreen'
import { connectDeviceRequest } from '../../api/requests/connectDeviceRequest'
import { screenQuery } from '../../api/queries/screenQuery'
import { ModalClose } from '@shared/ui/modal/Modal'

type Props = {
	onClose: () => void
}

export const ConnectDeviceModal = ({ onClose }: Props) => {
    const screen = useScreen()

    const currentScreenQuery = screenQuery(screen.id)

    const queryClient = useQueryClient()

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm<ConnectDeviceRequestData>({
        defaultValues: {
            connectionCode: '',
            screenId: screen.id
        }
    })

    const { mutate, isPending } = useMutation({
        mutationFn: (data: ConnectDeviceRequestData) => connectDeviceRequest(data),
        onSuccess: (data) => {
            queryClient.setQueryData(currentScreenQuery.queryKey, (oldData: Screen) => {
                if (!oldData) return oldData
				
                return {
				  ...oldData,
				  device: data,
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

                        setError(field as keyof ConnectDeviceRequestData, {
                            type: 'custom',
                            message: messageString
                        })
				  }
                }
            }
        }
    })

    const onSubmit: SubmitHandler<ConnectDeviceRequestData> = (data) => {
        mutate(data)
    }
	  
    return (
        <>
            <div className='flex flex-col items-start gap-4'>
                <DialogDescription asChild>
                    <div className='flex flex-col gap-3 text-sm'>
                        <p>Enter the 6-character connection code that is displayed on the screen of the device running the Screenlite player app.</p>
                    </div>
                </DialogDescription>
                <form
                    onSubmit={ handleSubmit(onSubmit) }
                    className='w-full flex flex-col gap-2'
                >
                    <div className='bg-neutral-100 aspect-video flex w-full flex-col justify-center items-center rounded-sm'>
                        <div className='font-semibold'>
                            Connection code
                        </div>
                        <Controller
                            name='connectionCode'
                            control={ control }
                            render={ ({ field }) => (
                                <input
                                    type="text"
                                    placeholder='XXXXXX'
                                    className='bg-transparent border-b text-center focus:outline-hidden text-4xl tracking-widest w-48 py-3 uppercase border-neutral-700 font-mono'
                                    autoComplete='off'
                                    maxLength={ 6 }
                                    { ...field }
                                />
                            ) }
                        />
                    </div>
					
                    <InputError error={ errors.connectionCode?.message }/>
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
                    Connect
                </Button>
            </div>
        </>
		
    )
}
