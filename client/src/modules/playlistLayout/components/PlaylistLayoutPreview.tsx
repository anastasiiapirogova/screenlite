import { useEffect, useRef, useState } from 'react'
import { PlaylistLayout } from '../types'
import { twMerge } from 'tailwind-merge'

type Props = {
    playlistLayout: Pick<PlaylistLayout, 'resolutionWidth' | 'resolutionHeight' | 'sections'>,
    highlightedSectionId?: string
}

export const PlaylistLayoutPreview = ({ playlistLayout, highlightedSectionId }: Props) => {
    const parentRef = useRef<HTMLDivElement>(null)
    const [scale, setScale] = useState(1)
    const [offset, setOffset] = useState({ top: 0, left: 0 })

    const resolution = {
        width: playlistLayout.resolutionWidth,
        height: playlistLayout.resolutionHeight,
    }

    useEffect(() => {
        const resizeLayout = () => {
            if (parentRef.current) {
                const parentWidth = Math.floor(parentRef.current.offsetWidth)
                const parentHeight = Math.floor(parentRef.current.offsetHeight)

                const widthScale = parentWidth / resolution.width
                const heightScale = parentHeight / resolution.height
                const newScale = Math.min(widthScale, heightScale)

                const scaledWidth = Math.floor(resolution.width * newScale)
                const scaledHeight = Math.floor(resolution.height * newScale)

                const left = Math.floor((parentWidth - scaledWidth) / 2)
                const top = Math.floor((parentHeight - scaledHeight) / 2)

                setScale(newScale)
                setOffset({ top, left })
            }
        }

        const resizeObserver = new ResizeObserver(resizeLayout)
        const current = parentRef.current

        if (current) {
            resizeLayout()
            resizeObserver.observe(current)
        }

        return () => {
            if (current) {
                resizeObserver.unobserve(current)
            }
            resizeObserver.disconnect()
        }
    }, [resolution.width, resolution.height])

    return (
        <div
            ref={ parentRef }
            style={ {
                width: '100%',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
            } }
        >
            <div
                className='flex items-center justify-center bg-stripes-neutral'
                style={ {
                    position: 'absolute',
                    top: offset.top,
                    left: offset.left,
                    width: Math.floor(resolution.width * scale),
                    height: Math.floor(resolution.height * scale),
                    backgroundColor: 'lightgray',
                } }
            >
                { playlistLayout.sections.map((section) => (
                    <div
                        key={ section.id }
                        className={ twMerge(
                            'flex items-center justify-center box-border bg-neutral-100',
                            highlightedSectionId === section.id && 'bg-blue-200'
                        ) }
                        style={ {
                            position: 'absolute',
                            top: Math.floor(section.top * scale),
                            left: Math.floor(section.left * scale),
                            width: Math.floor(section.width * scale),
                            height: Math.floor(section.height * scale),
                            zIndex: section.zIndex,
                            boxSizing: 'border-box',
                            border: '1px solid black',
                        } }
                    />
                )) }
            </div>
        </div>
    )
}
