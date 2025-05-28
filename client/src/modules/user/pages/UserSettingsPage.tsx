import { currentUserQuery } from '@modules/auth/api/queries/currentUser'
import { useCurrentUser } from '@modules/auth/hooks/useCurrentUser'
import { useQueryClient } from '@tanstack/react-query'
import { updateUserRequest } from '../api/requests/updateUserRequest'

export const UserSettingsPage = () => {
	    const queryClient = useQueryClient()
    const user = useCurrentUser()

    const updateUser = async () => {
        const data = await updateUserRequest({
            userId: user.id,
            name: 'New Name',
        })

        queryClient.setQueryData(currentUserQuery().queryKey, data)
    }

    return (
        <div>UserSettingsPage

            <div
                onClick={ updateUser }
                className='cursor-pointer text-blue-500 hover:underline'
            >
                Update
            </div>
        </div>
    )
}
