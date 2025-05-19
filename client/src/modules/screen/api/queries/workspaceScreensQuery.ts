import { WorkspaceScreensFilters, workspaceScreensRequest } from '../requests/workspaceScreensRequest'

export const workspaceScreensQuery = ({
    slug,
    filters
}: {
    slug: string
    filters: WorkspaceScreensFilters
}) => ({
    queryKey: ['workspaceScreens', { slug, filters }],
    queryFn: async () => workspaceScreensRequest(slug, filters)
})