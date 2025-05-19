import { Link, useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { workspaceQuery } from '../../modules/workspace/api/queries/workspaceQuery'

export const NavbarCurrentWorkspace = () => {
    const params = useParams<{ workspaceSlug: string }>()

    const { workspaceSlug } = params

    const querySettings = workspaceQuery(workspaceSlug!)
	
    const { data: workspace } = useQuery({
        ...querySettings,
        enabled: !!workspaceSlug,
    })

    if (!workspaceSlug || !workspace) return null

    return (
        <div className='flex items-center gap-3'>
            <div className='flex items-center gap-3'>
                <Link 
                    to={ `/workspaces/${workspace.slug}` } 
                    className={ 'font-medium px-2 py-1 rounded-sm hover:bg-neutral-100 transition-colors' }
                >
                    { workspace.name }
                </Link>
            </div>
        </div>
    )
}
