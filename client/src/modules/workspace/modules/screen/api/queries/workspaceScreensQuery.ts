import { workspaceScreensRequest, WorkspaceScreensRequestData } from '../requests/workspaceScreensRequest'

export const workspaceScreensQuery = (data: WorkspaceScreensRequestData) => ({
    queryKey: ['workspaceScreens', data],
    queryFn: async () => workspaceScreensRequest(data)
})