import { currentUserRequest } from '../requests/currentUserRequest'

export const currentUserQuery = () => ({
    queryKey: ['currentUser'],
    queryFn: currentUserRequest,
})