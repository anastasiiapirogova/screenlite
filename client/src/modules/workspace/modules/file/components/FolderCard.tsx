import { createElement, forwardRef } from 'react'
import React from 'react'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { Folder } from '../types'
import { FolderCardBody } from './FolderCardBody'
import { useNavigate } from 'react-router'
import { useWorkspaceRoutes } from '@modules/workspace/hooks/useWorkspaceRoutes'
import { useSelectionStore } from '@stores/useSelectionStore'
import { useShallow } from 'zustand/react/shallow'

interface PlaylistSectionItemCardProps extends React.HTMLAttributes<HTMLDivElement> {
	folder: Folder
	isDragging?: boolean
}

export const FolderCard = forwardRef<HTMLDivElement, PlaylistSectionItemCardProps>(({ folder, isDragging, onClick, ...props }, ref) => {
    const navigate = useNavigate()
    const routes = useWorkspaceRoutes()
    const { isSelected } = useSelectionStore(useShallow((state) => ({
        isSelected: state.isSelected,
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
                'cursor-default p-3 outline-none',
                !selected && !isDragging && 'hover:bg-gray-100',
                selected && 'bg-blue-100',
                (isDragging && selected) && 'opacity-50'
            ].join(' ') }
            ref={ ref }
            onClick={ onClick }
        >
            { createElement(FolderCardBody, { folder }) }
        </div>
    )
})

export const DraggableFolderCard = (props: { folder: Folder, onClick?: (e: React.MouseEvent) => void }) => {
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
            className={ isOver ? 'bg-gray-100' : '' }
        >
            <FolderCard
                folder={ folder }
                ref={ setNodeRef }
                onClick={ onClick }
                { ...attributes }
                { ...listeners }
            />
        </div>
    )
}