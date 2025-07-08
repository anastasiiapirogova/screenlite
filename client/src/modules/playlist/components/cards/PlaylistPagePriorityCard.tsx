import { updatePlaylistRequest, UpdatePlaylistRequestData } from '@modules/playlist/api/requests/updatePlaylistRequest'
import { usePlaylist } from '@modules/playlist/hooks/usePlaylist'
import { useSetPlaylistQueryData } from '@modules/playlist/hooks/useSetPlaylistQueryData'
import { useWorkspace } from '@modules/workspace/hooks/useWorkspace'
import { EntityPageCard } from '@shared/components/EntityPageCard'
import { Button } from '@shared/ui/buttons/Button'
import { Input } from '@shared/ui/input/Input'
import { useMutation } from '@tanstack/react-query'
import { useClickAway } from '@uidotdev/usehooks'
import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'

const usePriority = (initialPriority: number) => {
    const [editMode, setEditMode] = useState(false)
    const [priority, setPriority] = useState<string | number>(initialPriority)

    useEffect(() => {
        if (editMode) {
            setPriority(initialPriority)
        }
    }, [editMode, initialPriority])

    return { editMode, setEditMode, priority, setPriority }
}

const PriorityInput = ({ priority, setPriority, initialPriority }: { priority: string | number, setPriority: (value: string) => void, initialPriority: number }) => (
    <Input
        value={ priority }
        placeholder={ initialPriority.toString() }
        className='text-4xl flex h-16 items-center'
        onChange={ (e) => {
            let value = e.target.value.replace(/[^\d]/g, '')

            if (parseInt(value) > 1_000_000) {
                value = '1000000'
            }

            setPriority(value)
        } }
    />
)

const PriorityDisplay = ({ priority }: { priority: number }) => (
    <div className={ twMerge(
        'text-4xl',
        'flex h-16 items-center',
        'text-neutral-500'
    ) }
    >
        { priority }
    </div>
)

const PriorityActions = ({ onCancel, onSave, isPending, isDisabled }: { onCancel: () => void, onSave: () => void, isPending: boolean, isDisabled: boolean }) => (
    <div className='flex gap-2 items-center'>
        <Button
            size='small'
            color='secondary'
            variant='soft'
            className='rounded-full'
            onClick={ onCancel }
        >
            Cancel
        </Button>
        <Button
            size='small'
            className='rounded-full'
            onClick={ onSave }
            disabled={ isDisabled || isPending }
        >
            Save
        </Button>
    </div>
)

export const PlaylistPagePriorityCard = () => {
    const { priority: initialPriority, id } = usePlaylist()
    const { editMode, setEditMode, priority, setPriority } = usePriority(initialPriority)
    const ref = useClickAway<HTMLDivElement>(() => setEditMode(false))
    const setPlaylistQueryData = useSetPlaylistQueryData()
    const workspace = useWorkspace()

    const { mutate, isPending } = useMutation({
        mutationFn: (data: UpdatePlaylistRequestData) => updatePlaylistRequest(data),
        onSuccess: async (playlist) => {
            setPlaylistQueryData(playlist.id, playlist)
            setEditMode(false)
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const submit = () => {
        if (priority == initialPriority) {
            setEditMode(false)
            return
        }

        mutate({
            playlistId: id,
            priority: typeof priority !== 'number' ? parseInt(priority) : priority,
            workspaceId: workspace.id
        })
    }

    return (
        <EntityPageCard
            title="Priority"
            actionName={ !editMode ? 'Change priority' : undefined }
            onClick={ !editMode ? () => setEditMode(true) : undefined }
        >
            <div ref={ ref }>
                {
                    editMode ? (
                        <PriorityInput
                            priority={ priority }
                            setPriority={ setPriority }
                            initialPriority={ initialPriority }
                        />
                    ) : (
                        <PriorityDisplay priority={ initialPriority } />
                    )
                }
                {
                    editMode && (
                        <PriorityActions
                            onCancel={ () => setEditMode(false) }
                            onSave={ submit }
                            isPending={ isPending }
                            isDisabled={ priority == initialPriority || !priority }
                        />
                    )
                }
            </div>
            
        </EntityPageCard>
    )
}