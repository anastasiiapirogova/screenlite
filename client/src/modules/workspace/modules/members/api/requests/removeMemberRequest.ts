import axios from '@config/axios'

export type RemoveMemberRequestData = {
    workspaceId: string
    userId: string
}

export const removeMemberRequest = async (data: RemoveMemberRequestData) => {
    const response = await axios.post(`/workspaces/${data.workspaceId}/members/${data.userId}/remove`)
    
    return response.data
}