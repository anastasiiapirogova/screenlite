import { createElement, forwardRef } from 'react'
import { CSS } from '@dnd-kit/utilities'
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

    const { setNodeRef: setDroppableRef } = useDroppable({
        id: folder.id,
    })

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging
    } = useDraggable({
        id: folder.id,
        data: {
            folder,
            action: 'sort',
            modifiers: []
        }
    })

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        opacity: isDragging ? 0 : 1,
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
                { ...attributes }
                { ...listeners }
            />
        </div>
    )
}