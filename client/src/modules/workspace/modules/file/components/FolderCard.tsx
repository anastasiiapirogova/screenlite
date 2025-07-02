import { createElement, forwardRef } from 'react'
import React from 'react'
import { FolderWithChildrenCount } from '../types'
import { FolderCardBody } from './FolderCardBody'
import { useNavigate } from 'react-router'
import { useWorkspaceRoutes } from '@modules/workspace/hooks/useWorkspaceRoutes'
import { useSelectionStore } from '@stores/useSelectionStore'
import { useShallow } from 'zustand/react/shallow'
import { DraggableWrapper } from '@shared/components/DraggableWrapper'
import { DroppableWrapper } from '@shared/components/DroppableWrapper'

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
                />
            </DraggableWrapper>
        </DroppableWrapper>
    )
}