import { createElement, forwardRef } from 'react'
import React from 'react'
import { FolderWithChildrenCount } from '../types'
import { FolderCardBody } from './FolderCardBody'
import { useSelectionStore } from '@stores/useSelectionStore'
import { useShallow } from 'zustand/react/shallow'
import { DraggableWrapper } from '@shared/components/DraggableWrapper'
import { DroppableWrapper } from '@shared/components/DroppableWrapper'

interface PlaylistSectionItemCardProps extends React.HTMLAttributes<HTMLDivElement> {
	folder: FolderWithChildrenCount
	isOver?: boolean
	onContextMenu?: (e: React.MouseEvent) => void
	onDoubleClick?: (e: React.MouseEvent) => void
}

export const FolderCard = forwardRef<HTMLDivElement, PlaylistSectionItemCardProps>(({ folder, onClick, isOver, onContextMenu, onDoubleClick, ...props }, ref) => {
    const { isSelected, isDragging } = useSelectionStore(useShallow((state) => ({
        isSelected: state.isSelected,
        isDragging: state.isDragging,
    })))
    const selected = isSelected(folder.id)

    return (
        <div
            onDoubleClick={ onDoubleClick }
            { ...props }
            data-entity="folder"
            className={ [
                'cursor-default p-4 outline-none rounded-xl transition-all duration-200 border',
                !selected && !isDragging && 'hover:bg-gray-50',
                selected && 'bg-blue-50 border-blue-200',
                (isDragging && selected) && 'opacity-50',
                isOver && !selected && 'bg-gray-100'
            ].join(' ') }
            ref={ ref }
            onClick={ onClick }
            onContextMenu={ onContextMenu }
        >
            { createElement(FolderCardBody, { folder }) }
        </div>
    )
})

export const DraggableFolderCard = (props: { folder: FolderWithChildrenCount, onClick?: (e: React.MouseEvent) => void, onContextMenu?: (e: React.MouseEvent) => void, onDoubleClick?: (e: React.MouseEvent) => void }) => {
    const { folder, onClick, onContextMenu, onDoubleClick } = props

    return (
        <DroppableWrapper
            id={ folder.id }
            isOverClassName="bg-gray-100"
        >
            <DraggableWrapper
                id={ folder.id }
                data={ { folder } }
                action="dragFolder"
            >
                <FolderCard
                    folder={ folder }
                    onClick={ onClick }
                    onContextMenu={ onContextMenu }
                    onDoubleClick={ onDoubleClick }
                />
            </DraggableWrapper>
        </DroppableWrapper>
    )
}