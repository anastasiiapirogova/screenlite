import { getFileThumbnailSrc } from '@workspaceModules/file/utils/getFileThumbnailSrc'
import React, { useEffect, useRef, useState } from 'react'
import { TbCamera } from 'react-icons/tb'

type UserAvatarProps = {
	name: string;
	profilePhoto: string | null;
	preview?: File | null
	onChange?: (file: File) => void;
}

const PreviewRenderer = ({ preview }: { preview: File | null }) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null)

    useEffect(() => {
        if (preview) {
            const reader = new FileReader()

            reader.onloadend = () => {
                setImageSrc(reader.result as string)
            }
            reader.readAsDataURL(preview)
        } else {
            setImageSrc(null)
        }
    }, [preview])

    return imageSrc ? (
        <img
            src={ imageSrc }
            alt="Preview"
            className="w-full h-full object-cover rounded-full block"
        />
    ) : null
}

export const UserAvatarUploadComponent = ({
    name,
    profilePhoto,
    preview,
    onChange,
}: UserAvatarProps) => {
    const inputRef = useRef<HTMLInputElement>(null)

    const getInitials = (name: string) => {
        const initials = name
            .split(' ')
            .map((n) => n[0])
            .join('')

        return initials.toUpperCase()
    }

    const handleClick = () => {
        inputRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (file) {
            onChange?.(file)
        }
    }

    const pixelSize = 112
    const fontSize = Math.round(pixelSize * 0.4)

    const sizeStyle: React.CSSProperties = {
        width: `${pixelSize}px`,
        height: `${pixelSize}px`,
        fontSize: `${fontSize}px`,
        cursor: 'pointer',
        position: 'relative',
    }

    return (
        <div
            className="relative rounded-full bg-gray-200 flex items-center justify-center overflow-hidden select-none group"
            style={ sizeStyle }
            onClick={ handleClick }
            tabIndex={ 0 }
            role="button"
            aria-label="Upload avatar"
        >
            <input
                ref={ inputRef }
                type="file"
                accept="image/jpeg,image/png"
                style={ { display: 'none' } }
                onChange={ handleFileChange }
            />
            { preview ? (
                <PreviewRenderer preview={ preview }/>
            ) : profilePhoto ? (
                <img
                    src={ getFileThumbnailSrc(profilePhoto) }
                    alt={ `${name}'s avatar` }
                    className="w-full h-full object-cover rounded-full block"
                />
            ) : (
                <span style={ { fontSize: `${fontSize}px` } }>{ getInitials(name) }</span>
            ) }
            <div
                className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={ { pointerEvents: 'none' } }
            >
                <TbCamera
                    size={ fontSize }
                    color="#fff"
                />
            </div>
        </div>
    )
}
