import { useWorkspace } from '@modules/workspace/hooks/useWorkspace'
import { useWorkspaceRoutes } from '@modules/workspace/hooks/useWorkspaceRoutes'
import { SettingsCard } from '@shared/components/SettingsCard'
import { Button } from '@shared/ui/buttons/Button'
import { useNavigate } from 'react-router'

export const WorkspaceMembersCard = () => {
    const workspace = useWorkspace()
    const navigate = useNavigate()
    const routes = useWorkspaceRoutes()
    
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
                        onClick={ () => navigate(routes.workspaceMembersList) }
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
