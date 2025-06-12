import { createElement, forwardRef } from 'react'
import { CSS } from '@dnd-kit/utilities'
import React from 'react'
import { useDraggable } from '@dnd-kit/core'
import { FileCardBody } from './FileCardBody'
import { WorkspaceFile } from '../types'

interface PlaylistSectionItemCardProps extends React.HTMLAttributes<HTMLDivElement> {
	file: WorkspaceFile
	isDragging?: boolean
}

export const FileCard = forwardRef<HTMLDivElement, PlaylistSectionItemCardProps>(({ file, isDragging, ...props }, ref) => {
    return (
        <div
            { ...props }
            className={ [
                'cursor-default p-3',
                isDragging ? 'bg-gray-100' : 'hover:bg-gray-100',
            ].join(' ') }
            ref={ ref }
        >
            { createElement(FileCardBody, { file }) }
        </div>
    )
})

export const DraggableFileCard = (props: { file: WorkspaceFile }) => {
    const { file } = props

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging
    } = useDraggable({
        id: file.id,
        data: {
            file,
            action: 'sort',
            modifiers: [],
        }
    })

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        opacity: isDragging ? 0 : 1,
        touchAction: 'none',
        userSelect: 'none',
    }
	
    return (
        <FileCard
            file={ file }
            ref={ setNodeRef }
            style={ style }
            { ...attributes }
            { ...listeners }
        />
    )
}