import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useWorkspace } from '@modules/workspace/hooks/useWorkspace'
import { workspaceFoldersQuery } from '../api/workspaceFolders'
import { Folder } from '../types'
import { Button } from '@shared/ui/buttons/Button'
import { TbFolder, TbFolderOpen, TbCheck, TbChevronRight, TbHome } from 'react-icons/tb'
import { twMerge } from 'tailwind-merge'
import { Modal } from '@shared/ui/modal/Modal'

interface FolderSelectorModalProps {
    open: boolean
    onClose: () => void
    onSelect: (folderId: string | null, folder?: Folder) => void
    selectedFolderId?: string | null
}

interface FolderItemProps {
    folder: Folder
    selectedFolderId?: string | null
    onSelect: (folderId: string, folder: Folder) => void
    onOpen: (folderId: string) => void
}

const FolderItem = ({ folder, selectedFolderId, onSelect, onOpen }: FolderItemProps) => {
    const isSelected = selectedFolderId === folder.id

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        onSelect(folder.id, folder)
    }

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        onOpen(folder.id)
    }

    return (
        <div
            className={ twMerge(
                'flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-colors',
                'hover:bg-gray-50',
                isSelected && 'bg-blue-50 border border-blue-200'
            ) }
            onClick={ handleClick }
            onDoubleClick={ handleDoubleClick }
        >
            <div className="flex items-center gap-2 flex-1">
                <TbFolder className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-900 truncate">
                    { folder.name }
                </span>
            </div>
            <TbChevronRight className="w-4 h-4 text-gray-400" />
            { isSelected && (
                <TbCheck className="w-4 h-4 text-blue-500" />
            ) }
        </div>
    )
}

export const FolderSelectorModal = ({ open, onClose, onSelect, selectedFolderId }: FolderSelectorModalProps) => {
    const workspace = useWorkspace()
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
    const [currentSelection, setCurrentSelection] = useState<string | null>(selectedFolderId || null)
    const [folderPath, setFolderPath] = useState<Folder[]>([])

    const { data: folders, isLoading } = useQuery(workspaceFoldersQuery({
        id: workspace.id,
        filters: {
            parentId: currentFolderId,
            deleted: false
        }
    }))

    const handleFolderSelect = (folderId: string) => {
        setCurrentSelection(folderId)
    }

    const handleFolderOpen = (folderId: string) => {
        const folder = folders?.find(f => f.id === folderId)

        if (folder) {
            setCurrentFolderId(folderId)
            setFolderPath([...folderPath, folder])
        }
    }

    const handleBreadcrumbClick = (index: number) => {
        if (index === -1) {
            setCurrentFolderId(null)
            setFolderPath([])
        } else {
            setCurrentFolderId(folderPath[index].id)
            setFolderPath(folderPath.slice(0, index + 1))
        }
    }

    const handleSelect = () => {
        if (currentSelection === null) {
            onSelect(null)
        } else if (currentSelection === currentFolderId && currentFolderId !== null) {
            const currentFolder = folderPath[folderPath.length - 1]

            onSelect(currentFolderId, currentFolder)
        } else {
            const selectedFolder = folders?.find(f => f.id === currentSelection)

            onSelect(currentSelection, selectedFolder)
        }
        onClose()
    }

    const handleCancel = () => {
        setCurrentSelection(selectedFolderId || null)
        setCurrentFolderId(null)
        setFolderPath([])
        onClose()
    }

    const handleSelectRoot = () => {
        setCurrentSelection(null)
    }

    const handleSelectCurrentFolder = () => {
        if (currentFolderId) {
            setCurrentSelection(currentFolderId)
        }
    }

    return (
        <Modal
            open={ open }
            onOpenChange={ onClose }
            title="Select Folder"
            maxWidth="max-w-md"
        >
            <div className="flex flex-col h-full">
                <div className="px-7 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-sm">
                        <button
                            onClick={ () => handleBreadcrumbClick(-1) }
                            className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <TbHome className="w-4 h-4" />
                            Root
                        </button>
                        { folderPath.map((folder, index) => (
                            <React.Fragment key={ folder.id }>
                                <TbChevronRight className="w-4 h-4 text-gray-400" />
                                <button
                                    onClick={ () => handleBreadcrumbClick(index) }
                                    className="text-gray-600 hover:text-gray-900 transition-colors truncate"
                                >
                                    { folder.name }
                                </button>
                            </React.Fragment>
                        )) }
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-7">
                    { currentFolderId === null && (
                        <div
                            className={ twMerge(
                                'flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-colors mb-4',
                                'hover:bg-gray-50',
                                currentSelection === null && 'bg-blue-50 border border-blue-200'
                            ) }
                            onClick={ handleSelectRoot }
                        >
                            <TbFolder className="w-5 h-5 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">
                                Root Folder
                            </span>
                            { currentSelection === null && (
                                <TbCheck className="w-4 h-4 text-blue-500 ml-auto" />
                            ) }
                        </div>
                    ) }

                    { currentFolderId !== null && (
                        <div
                            className={ twMerge(
                                'flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-colors mb-4',
                                'hover:bg-gray-50',
                                currentSelection === currentFolderId && 'bg-blue-50 border border-blue-200'
                            ) }
                            onClick={ handleSelectCurrentFolder }
                        >
                            <TbFolderOpen className="w-5 h-5 text-blue-500" />
                            <span className="text-sm font-medium text-gray-900">
                                { folderPath[folderPath.length - 1]?.name || 'Current Folder' }
                            </span>
                            { currentSelection === currentFolderId && (
                                <TbCheck className="w-4 h-4 text-blue-500 ml-auto" />
                            ) }
                        </div>
                    ) }

                    <div className="space-y-1">
                        { isLoading ? (
                            Array.from({ length: 3 }).map((_, index) => (
                                <div
                                    key={ index }
                                    className="flex items-center gap-3 px-4 py-2 rounded-lg animate-pulse"
                                >
                                    <div className="w-5 h-5 bg-gray-200 rounded" />
                                    <div className="flex-1">
                                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                                    </div>
                                    <div className="w-4 h-4 bg-gray-200 rounded" />
                                </div>
                            ))
                        ) : folders && folders.length > 0 ? (
                            folders.map((folder) => (
                                <FolderItem
                                    key={ folder.id }
                                    folder={ folder }
                                    selectedFolderId={ currentSelection }
                                    onSelect={ handleFolderSelect }
                                    onOpen={ handleFolderOpen }
                                />
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <TbFolder className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                <p className="text-sm">No subfolders in this location</p>
                            </div>
                        ) }
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 p-7 border-t border-gray-200">
                    <Button
                        variant="ghost"
                        onClick={ handleCancel }
                    >
                        Cancel
                    </Button>
                    <Button onClick={ handleSelect }>
                        Select Folder
                    </Button>
                </div>
            </div>
        </Modal>
    )
} 