import { createElement, forwardRef } from 'react'
import React from 'react'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { Folder } from '../types'
import { FolderCardBody } from './FolderCardBody'
import { useNavigate } from 'react-router'
import { useWorkspaceRoutes } from '@modules/workspace/hooks/useWorkspaceRoutes'

interface PlaylistSectionItemCardProps extends React.HTMLAttributes<HTMLDivElement> {
	folder: Folder
	isDragging?: boolean
}

export const FolderCard = forwardRef<HTMLDivElement, PlaylistSectionItemCardProps>(({ folder, isDragging, ...props }, ref) => {
    const navigate = useNavigate()
    const routes = useWorkspaceRoutes()

    return (
        <div
            onDoubleClick={ () => {
                navigate(routes.folder(folder.id))
            } }
            { ...props }
            className={ [
                'cursor-default p-3',
                isDragging ? 'bg-gray-100' : 'hover:bg-gray-100',
            ].join(' ') }
            ref={ ref }
        >
            { createElement(FolderCardBody, { folder }) }
        </div>
    )
})

export const DraggableFolderCard = (props: { folder: Folder }) => {
    const { folder } = props

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
            action: 'sort',
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
                { ...attributes }
                { ...listeners }
            />
        </div>
    )
}