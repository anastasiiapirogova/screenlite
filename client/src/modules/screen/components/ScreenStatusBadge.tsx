import { useScreenStatus } from '../hooks/useScreenStatus'
import { Screen } from '../types'

export const ScreenStatusBadge = ({ screen }: { screen: Screen }) => {
    const { title } = useScreenStatus(screen)

    return (
        <div className='inline-flex px-2 rounded-full text-sm bg-neutral-200 text-neutral-700'>
            { title }
        </div>
    )
}
