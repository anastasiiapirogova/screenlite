import { createElement, forwardRef } from 'react'
import React from 'react'
import { useDraggable } from '@dnd-kit/core'
import { FileCardBody } from './FileCardBody'
import { WorkspaceFile } from '../types'
import { useSelectionStore } from '@stores/useSelectionStore'
import { useShallow } from 'zustand/react/shallow'

interface PlaylistSectionItemCardProps extends React.HTMLAttributes<HTMLDivElement> {
	file: WorkspaceFile
	isDragging?: boolean
}

export const FileCard = forwardRef<HTMLDivElement, PlaylistSectionItemCardProps>(({ file, onClick, onDoubleClick, onContextMenu, ...props }, ref) => {
    const { isSelected, isDragging } = useSelectionStore(useShallow((state) => ({
        isSelected: state.isSelected,
        isDragging: state.isDragging,
    })))

    const selected = isSelected(file.id)

    const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault()
        onContextMenu?.(event)
    }

    return (
        <div
            { ...props }
            data-entity="file"
            className={ [
                'cursor-default p-4 outline-none rounded-xl transition-all duration-200 border',
                !selected && !isDragging && 'hover:bg-gray-50',
                selected && 'bg-blue-50 border-blue-200',
                (isDragging && selected) && 'opacity-50'
            ].join(' ') }
            ref={ ref }
            onClick={ onClick }
            onDoubleClick={ onDoubleClick }
            onContextMenu={ handleContextMenu }
        >
            { createElement(FileCardBody, { file }) }
        </div>
    )
})

export const DraggableFileCard = (props: { file: WorkspaceFile, onClick?: (e: React.MouseEvent) => void, onDoubleClick?: (e: React.MouseEvent) => void, onContextMenu?: (e: React.MouseEvent) => void }) => {
    const { file, onClick, onDoubleClick, onContextMenu } = props

    const {
        attributes,
        listeners,
        setNodeRef
    } = useDraggable({
        id: file.id,
        data: {
            file,
            action: 'dragFile',
            modifiers: [],
        }
    })

    const style: React.CSSProperties = {
        touchAction: 'none',
        userSelect: 'none',
    }
	
    return (
        <FileCard
            file={ file }
            ref={ setNodeRef }
            style={ style }
            onClick={ onClick }
            onDoubleClick={ onDoubleClick }
            onContextMenu={ onContextMenu }
            { ...attributes }
            { ...listeners }
        />
    )
}