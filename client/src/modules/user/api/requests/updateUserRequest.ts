import axios from '@config/axios'
import { User } from '@modules/user/types'

export type UpdateUserData = {
	userId: string
	name?: string
	profilePhoto?: File | null
}

type UpdateUserResponse = {
	user: User
}

export const updateUserRequest = async (data: UpdateUserData) => {
    const formData = new FormData()

    formData.append('userId', data.userId)
    if (data.name !== undefined) {
        formData.append('name', data.name)
    }
    if (data.profilePhoto !== undefined) {
        if (data.profilePhoto === null) {
            formData.append('profilePhoto', 'null')
        } else {
            formData.append('profilePhoto', data.profilePhoto)
        }
    }

    const response = await axios.patch<UpdateUserResponse>(
        `/users/${data.userId}`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    )

    return response.data.user
}