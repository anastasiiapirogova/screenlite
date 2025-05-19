interface UserAvatarProps {
	name: string
	profilePhoto: string | null
}

export const UserAvatar = ({ name, profilePhoto }: UserAvatarProps) => {
    const getInitials = (name: string) => {
        const initials = name.split(' ').map(n => n[0]).join('')

        return initials.toUpperCase()
    }

    return (
        <div className="rounded-full bg-gray-200 w-10 h-10 flex items-center justify-center">
            { profilePhoto ? (
                <img
                    src={ profilePhoto }
                    alt={ `${name}'s avatar` }
                    className="object-cover w-full h-full"
                />
            ) : (
                <div className="select-none">{ getInitials(name) }</div>
            ) }
        </div>
    )
}
