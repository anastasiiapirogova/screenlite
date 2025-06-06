import { useWorkspace } from '@modules/workspace/hooks/useWorkspace'
import { SettingsCard } from '@shared/components/SettingsCard'
import { Button } from '@shared/ui/buttons/Button'

export const WorkspaceMembersCard = () => {
    const workspace = useWorkspace()

    return (
        <SettingsCard
            title='Members'
            description='Members are users who have access to this workspace.'
        >
            <div className='m-5'>
                <div className='text-4xl mb-2'>
                    { workspace._count.members }
                </div>
                <div className='flex justify-end'>
                    <Button
                        onClick={ alert.bind(null, 'This feature is not implemented yet.') }
                        color='secondary'
                        variant="soft"
                    >
                        View members
                    </Button>
                </div>
            </div>
        </SettingsCard>
    )
}
