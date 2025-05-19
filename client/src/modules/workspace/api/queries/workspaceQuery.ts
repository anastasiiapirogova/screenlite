import { workspaceRequest } from '../requests/workspaceRequest'

export const workspaceQuery = (slug: string) => ({
    queryKey: ['workspace', { slug }],
    queryFn: async () => workspaceRequest(slug)
})