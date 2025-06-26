import { createElement, forwardRef } from 'react'
import React from 'react'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { FolderWithChildrenCount } from '../types'
import { FolderCardBody } from './FolderCardBody'
import { useNavigate } from 'react-router'
import { useWorkspaceRoutes } from '@modules/workspace/hooks/useWorkspaceRoutes'
import { useSelectionStore } from '@stores/useSelectionStore'
import { useShallow } from 'zustand/react/shallow'

interface PlaylistSectionItemCardProps extends React.HTMLAttributes<HTMLDivElement> {
	folder: FolderWithChildrenCount
	isOver?: boolean
}

export const FolderCard = forwardRef<HTMLDivElement, PlaylistSectionItemCardProps>(({ folder, onClick, isOver, ...props }, ref) => {
    const navigate = useNavigate()
    const routes = useWorkspaceRoutes()
    const { isSelected, isDragging } = useSelectionStore(useShallow((state) => ({
        isSelected: state.isSelected,
        isDragging: state.isDragging,
    })))
    const selected = isSelected(folder.id)

    return (
        <div
            onDoubleClick={ () => {
                navigate(routes.folder(folder.id))
            } }
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
        >
            { createElement(FolderCardBody, { folder }) }
        </div>
    )
})

export const DraggableFolderCard = (props: { folder: FolderWithChildrenCount, onClick?: (e: React.MouseEvent) => void }) => {
    const { folder, onClick } = props

    const { setNodeRef: setDroppableRef, isOver } = useDroppable({
        id: folder.id,
    })

    const {
        attributes,
        listeners,
        setNodeRef,
    } = useDraggable({
        id: folder.id,
        data: {
            folder,
            action: 'dragFolder',
            modifiers: []
        }
    })

    const style: React.CSSProperties = {
        touchAction: 'none',
        userSelect: 'none',
    }
	
    return (
        <div
            ref={ setDroppableRef }
            style={ style }
        >
            <FolderCard
                folder={ folder }
                ref={ setNodeRef }
                onClick={ onClick }
                isOver={ isOver }
                { ...attributes }
                { ...listeners }
            />
        </div>
    )
}