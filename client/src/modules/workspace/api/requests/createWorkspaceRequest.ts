import axios from '@config/axios'
import { Workspace } from '@modules/workspace/types'

export type CreateWorkspaceRequestData = {
	name: string
	slug: string
}

type CreateWorkspaceRequestResponse = {
	workspace: Workspace
}

export const createWorkspaceRequest = async (data: CreateWorkspaceRequestData) => {
    const response = await axios.post<CreateWorkspaceRequestResponse>('/workspaces', data)

    return response.data.workspace
}