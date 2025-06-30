import { StorageService } from '@/utils/StorageService'

interface Props {
	name?: string
	picture?: string | null
	size?: number
}

export const WorkspacePicture = ({ name, picture, size = 40 }: Props) => {
    const getFirstLetter = (name: string) => name[0].toUpperCase()

    return (
        <div
            className="rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden"
            style={ { width: size, height: size } }
        >
            { picture ? (
                <img
                    src={ StorageService.getFileThumbnailSrc(picture) }
                    alt={ `${name} workspace picture` }
                    className="object-cover w-full h-full"
                />
            ) : (
                <div
                    className="select-none font-medium"
                    style={ { fontSize: size * 0.5 } }
                >
                    { name ? getFirstLetter(name) : 'S' }
                </div>
            ) }
        </div>
    )
}
