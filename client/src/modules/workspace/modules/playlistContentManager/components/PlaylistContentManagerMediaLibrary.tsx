import { ContentManagerFileSelector } from './ContentManagerFileSelector'

export const PlaylistContentManagerMediaLibrary = () => {
    return (
        <div className='sticky top-[64px] max-h-[calc(100vh-64px)] overflow-y-auto'>
            <ContentManagerFileSelector />
        </div>
    )
}
