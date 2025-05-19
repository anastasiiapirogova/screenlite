import { useEffect, useRef, useState } from 'react'
import { PlaylistLayout } from '../types'
import { twMerge } from 'tailwind-merge'

type Props =  {
    playlistLayout: Pick<PlaylistLayout, 'resolutionWidth' | 'resolutionHeight' | 'sections'>,
    highlightedSectionId?: string
}

export const PlaylistLayoutPreview = ({ playlistLayout, highlightedSectionId }: Props) => {
    const parentRef = useRef<HTMLDivElement>(null)
    const [scale, setScale] = useState(1)

    const resolution = {
        width: playlistLayout.resolutionWidth,
        height: playlistLayout.resolutionHeight,
    }

    useEffect(() => {
        const resizeSections = () => {
            if (parentRef.current) {
                const parentWidth = parentRef.current.offsetWidth
                const parentHeight = parentRef.current.offsetHeight

                let scale = 1

                if(resolution.width > resolution.height) {
                    scale = parentWidth / resolution.width
                } else {
                    scale = parentHeight / resolution.height
                }

                setScale(scale)
            }
        }

        const resizeObserver = new ResizeObserver(() => {
            resizeSections()
        })

        const currentParent = parentRef.current

        if (currentParent) {
            resizeObserver.observe(currentParent)
        }

        return () => {
            if (currentParent) {
                resizeObserver.unobserve(currentParent)
            }
            resizeObserver.disconnect()
        }
    }, [resolution.width, resolution.height, parentRef])

    return (
        <div
            ref={ parentRef }
            style={ {
                width: '100%',
                height: '100%',
                position: 'relative',
                overflow: 'hidden'
            } }
        >
            { /* Render the layout itself on the background */ }
            <div
                className='flex items-center justify-center bg-stripes-neutral'
                style={ {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: resolution.width * scale,
                    height: resolution.height * scale,
                    backgroundColor: 'lightgray',
                } }
            />
            { /* Render layout sections */ }
            { playlistLayout.sections.map((section) => (
                <div
                    key={ section.id }
                    className={
                        twMerge(
                            'flex items-center justify-center box-border bg-neutral-100',
                            highlightedSectionId === section.id && 'bg-blue-200'
                        )
                    }
                    style={ {
                        position: 'absolute',
                        top: section.top * scale,
                        left: section.left * scale,
                        width: section.width * scale,
                        height: section.height * scale,
                        zIndex: section.zIndex,
                        boxSizing: 'border-box',
                        border: '1px solid black',
                    } }
                />
            )) }
        </div>
    )
}