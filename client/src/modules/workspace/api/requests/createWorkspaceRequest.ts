import axios from '../../../../config/axios'
import { Workspace } from '../../types'

export type CreateWorkspaceRequestData = {
	name: string
	slug: string
}

type CreateWorkspaceRequestResponse = {
	workspace: Workspace
}

export const createWorkspaceRequest = async (data: CreateWorkspaceRequestData) => {
    const response = await axios.post<CreateWorkspaceRequestResponse>('/workspaces/create', data)

    return response.data.workspace
}