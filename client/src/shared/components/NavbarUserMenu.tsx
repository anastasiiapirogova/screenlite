import { useCurrentUser } from '@modules/auth/hooks/useCurrentUser'
import { UserAvatar } from './UserAvatar'

export const NavbarUserMenu = () => {
    const user = useCurrentUser()
	
    return (
        <UserAvatar
            name={ user.name }
            profilePhoto={ user.profilePhoto }
        />
    )
}
