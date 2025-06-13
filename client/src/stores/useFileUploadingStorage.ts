import { FileUploadingData, FileUploadSession } from '@workspaceModules/file/types'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

interface State {
	queue: FileUploadingData[]
	addFiles: (file: File[]) => void
	removeFile: (id: string) => void
	updateFileUploadingState: (id: string, session: FileUploadSession) => void
	updateFileUploadingProgress: (id: string, progress: number) => void
	setController: (id: string, controller: AbortController | null) => void
	pauseFile: (id: string) => void
	resumeFile: (id: string) => void
	restartUploading: (id: string) => void
	setError: (id: string, error: 'UNKNOWN_ERROR' | 'SESSION_INIT_FAILED' | '404' | '403' | '401' | null) => void,
	emptyQueue: () => void
}

export const useFileUploadingStorage = create<State>()(
    devtools(
        (set) => ({
            queue: [],
            addFiles: (files) => set(
                (state) => (
                    {
                        queue: [
                            ...state.queue,
                            ...files.map(file => ({
                                id: uuidv4(),
                                file,
                                session: null,
                                progress: 0,
                                controller: null,
                                isPaused: false,
                                error: null,
                            }))
                        ]
                    }
                )
            ),
            removeFile: (id) => set((state) => ({
                queue: state.queue.filter((file) => file.id !== id),
            })),
            updateFileUploadingState: (id, session) => set((state) => ({
                queue: state.queue.map((file) => {
                    if (file.id === id) {
                        return { ...file, session }
                    }

                    return file
                }),
            })),
            updateFileUploadingProgress: (id, loaded) => set((state) => ({
                queue: state.queue.map((item) => {
                    if (item.id === id) {
                        const uploaded = item.session ? parseInt(item.session.uploaded.toString()) + loaded : loaded
					
                        const progress = (uploaded / item.file.size) * 100

                        return { ...item, progress }
                    }

                    return item
                }),
            })),
            setController: (id, controller) => set((state) => ({
                queue: state.queue.map((file) => {
                    if (file.id === id) {
                        if (file.controller) {
                            file.controller.abort('New controller is set')
                        }
                        return { ...file, controller }
                    }

                    return file
                }),
            })),
            pauseFile: (id) => set((state) => ({
                queue: state.queue.map((file) => {
                    if (file.id === id) {
                        if (file.controller) {
                            file.controller.abort('File uploading is paused')
                        }
                        return { ...file, isPaused: true, controller: null }
                    }

                    return file
                }),
            })),
            resumeFile: (id) => set((state) => ({
                queue: state.queue.map((file) => {
                    if (file.id === id) {
                        return { ...file, isPaused: false }
                    }

                    return file
                }),
            })),
            restartUploading: (id) => set((state) => ({
                queue: state.queue.map((file) => {
                    if (file.id === id) {
                        return { ...file, isPaused: false, progress: 0, session: null }
                    }

                    return file
                }),
            })),
            setError: (id, error) => set((state) => ({
                queue: state.queue.map((file) => {
                    if (file.id === id) {
                        return { ...file, error, isPaused: true, controller: null }
                    }

                    return file
                }),
            })),
            emptyQueue: () => set(() => ({ queue: [] }))
        }),
        {
            name: 'file-uploadings-storage',
        },
    ),
)