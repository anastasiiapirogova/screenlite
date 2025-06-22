import { useRef } from 'react'
import { fileUploadService } from '../services/FileUploadService'
import { useWorkspace } from '@/modules/workspace/hooks/useWorkspace'

export const UploadFilesDropzone = () => {
    const { id: workspaceId } = useWorkspace()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFiles = (files: FileList | null) => {
        if (files) {
            fileUploadService.addFiles(Array.from(files), workspaceId)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files)
    }

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault()
        handleFiles(e.dataTransfer.files)
    }

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault()
    }

    return (
        <div className='flex flex-col items-start gap-4'>
            <div className="flex items-center justify-center w-full">
                <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50"
                    onDrop={ handleDrop }
                    onDragOver={ handleDragOver }
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                            className="w-10 h-10 mb-3 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">max 5 GB</p>
                    </div>
                    <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        multiple
                        ref={ fileInputRef }
                        onChange={ handleFilesChange }
                    />
                </label>
            </div>
        </div>
    )
}
