import axios from '@config/axios'
import { User } from '@modules/user/types'

export type UpdateUserData = {
	userId: string
	name?: string
	profilePhoto: File | null
	removeProfilePhoto: boolean
}

type UpdateUserResponse = {
	user: User
}

export const updateUserRequest = async (data: UpdateUserData) => {
    const formData = new FormData()

    formData.append('userId', data.userId)
    if (data.name) {
        formData.append('name', data.name)
    }
    if (data.removeProfilePhoto) {
        formData.append('removeProfilePhoto', 'true')
    }
    if (data.profilePhoto) {
        formData.append('profilePhoto', data.profilePhoto)
    }

    const response = await axios.patch<UpdateUserResponse>(
        `/users/${data.userId}/profile`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    )

    return response.data.user
}