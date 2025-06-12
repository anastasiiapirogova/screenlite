import { getFileThumbnailSrc } from '@workspaceModules/file/utils/getFileThumbnailSrc';
import React from 'react'

type UserAvatarProps = {
	name: string;
	profilePhoto: string | null;
	size?: 'small' | 'medium' | 'large';
}

const sizeMap = {
    small: 32,
    medium: 40,
    large: 56,
}

export const UserAvatar = ({
    name,
    profilePhoto,
    size = 'medium',
}: UserAvatarProps) => {
    const getInitials = (name: string) => {
        const initials = name
            .split(' ')
            .map((n) => n[0])
            .join('')

        return initials.toUpperCase()
    }

    const pixelSize = sizeMap[size]
    const fontSize = Math.round(pixelSize * 0.4)

    const sizeStyle: React.CSSProperties = {
        width: `${pixelSize}px`,
        height: `${pixelSize}px`,
        fontSize: `${fontSize}px`,
    }

    return (
        <div
            className="rounded-full bg-gray-200 flex items-center justify-center overflow-hidden select-none"
            style={ sizeStyle }
        >
            { profilePhoto ? (
                <img
                    src={ getFileThumbnailSrc(profilePhoto) }
                    alt={ `${name}'s avatar` }
                    className="w-full h-full object-cover rounded-full block"
                />
            ) : (
                <span style={ { fontSize: `${fontSize}px` } }>{ getInitials(name) }</span>
            ) }
        </div>
    )
}
