import { useWorkspace } from '@modules/workspace/hooks/useWorkspace'
import { SettingsCard } from '@shared/components/SettingsCard'
import { Button } from '@shared/ui/buttons/Button'

export const WorkspaceInvitationsCard = () => {
    const workspace = useWorkspace()
	
    return (
        <SettingsCard
            title='Invitations'
            description='Invitations are sent to users to join this workspace. They can accept or decline the invitation.'
        >
            <div className='m-5'>
                <div className='text-4xl'>
                    { workspace._count.invitations.pending }
                </div>
                <div className='text-neutral-500 mb-2'>
                    pending invitations
                </div>
                <div className='flex justify-end gap-3'>
                    <Button
                        onClick={ alert.bind(null, 'This feature is not implemented yet.') }
                        color='secondary'
                        variant="soft"
                    >
                        View invitations
                    </Button>
                    <Button
                        onClick={ alert.bind(null, 'This feature is not implemented yet.') }
                        color='primary'
                    >
                        Invite new member
                    </Button>
                </div>
            </div>
        </SettingsCard>
    )
}
