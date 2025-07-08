import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useWorkspace } from '@/modules/workspace/hooks/useWorkspace'
import { useNavigate } from 'react-router'
import { useWorkspaceRoutes } from '@/modules/workspace/hooks/useWorkspaceRoutes'
import { Select } from '@/shared/ui/Select'
import { ModalClose } from '@shared/ui/modal/Modal'
import { Input } from '@shared/ui/input/Input'
import { useRefetchWorkspaceEntityCounts } from '@modules/workspace/hooks/useRefetchWorkspaceEntityCounts'
import { handleAxiosFieldErrors } from '@shared/helpers/handleAxiosFieldErrors'
import { CreateScreenRequestData } from '@modules/screen/types'
import { createScreenRequest } from '@modules/screen/api/requests/createScreenRequest'
import { screenQuery } from '@modules/screen/api/queries/screenQuery'
import { InputLabelGroup } from '@shared/ui/input/InputLabelGroup'
import { InputError } from '@shared/ui/input/InputError'
import { screenTypes } from '@modules/screen/helper/screenTypes'
import { Button } from '@shared/ui/buttons/Button'

export const CreateScreenModal = () => {
    const workspace = useWorkspace()
    const routes = useWorkspaceRoutes()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const refetchEntityCounts = useRefetchWorkspaceEntityCounts()

    const {
        control,
        handleSubmit,
        setError,
        setValue,
        formState: { errors },
        watch
    } = useForm<CreateScreenRequestData>({
        defaultValues: {
            name: '',
            workspaceId: workspace.id,
            type: 'consumer_tv'
        }
    })

    const { mutate, isPending } = useMutation({
        mutationFn: (data: CreateScreenRequestData) => createScreenRequest(data),
        onSuccess: async (screen) => {
            queryClient.setQueryData(screenQuery({
                screenId: screen.id,
                workspaceId: workspace.id
            }).queryKey, screen)
            refetchEntityCounts()
            navigate(routes.screen(screen.id))
        },
        onError: (error) => {
            handleAxiosFieldErrors<CreateScreenRequestData>(error, setError)
        }
    })

    const onSubmit: SubmitHandler<CreateScreenRequestData> = (data) => {
        mutate(data)
    }
	  
    return (
        <div className='px-7 flex flex-col gap-5 mt-5'>
            <div className='flex flex-col items-start gap-4'>
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
                                    placeholder='Enter a descriptive screen name'
                                />
                            ) }
                        />
                        <InputError error={ errors.name?.message }/>
                    </InputLabelGroup>
                    <InputLabelGroup
                        label='Type'
                        name='type'
                    >
                        <Select
                            onChange={ (value) => setValue('type', value) }
                            options={ screenTypes }
                            value={ watch().type }
                        />
                        <InputError error={ errors.type?.message }/>
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
                    Create screen
                </Button>
            </div>
        </div>
    )
}
