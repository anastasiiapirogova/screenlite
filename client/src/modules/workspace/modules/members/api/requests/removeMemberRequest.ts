import axios from "axios"

export type RemoveMemberRequestData = {
    workspaceId: string
    userId: string
}

export const removeMemberRequest = async (data: RemoveMemberRequestData) => {
    const response = await axios.delete(`/workspace/${data.workspaceId}/members/${data.userId}/remove`)
    
    return response.data
}