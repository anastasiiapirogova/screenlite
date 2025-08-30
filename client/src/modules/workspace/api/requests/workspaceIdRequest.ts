import axios from '@config/axios'

type WorkspacesRequestResponse = {
	workspaceId: string
}

export const workspaceIdRequest = async (slug: string) => {
    const response = await axios.get<WorkspacesRequestResponse>(`/workspaces/by-slug/${slug}/id`)

    return response.data.workspaceId
}

export const workspaceIdQuery = (slug: string) => ({
    queryKey: ['workspaceId', { slug }],
    queryFn: async () => workspaceIdRequest(slug)
})