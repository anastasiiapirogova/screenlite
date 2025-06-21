export type FileUploadSession = {
	id: string
	name: string
	path: string
	size: string
	uploaded: string
	uploadedParts: number
	workspaceId: string
	folderId: string | null
	userId: string
	createdAt: string
	completedAt: string | null
	cancelledAt: string | null
	mimeType: string
	uploadId: string | null
}

export type FileUploadingData = {
	id: string
	session: FileUploadSession | null
	file: File
	progress: number
	controller: AbortController | null
	isPaused: boolean
	error: 'UNKNOWN_ERROR' | 'SESSION_INIT_FAILED' | '404' | '403' | '401' | null
}

// The name WorkspaceFile is used to avoid confusion with the built-in File type
export type WorkspaceFile = {
	id: string
	workspaceId: string
	name: string
	uniqueName: string
	previewPath: string | null
	defaultDuration?: number
	size: bigint
	type: string
	path: string
	mimeType: string
	width: number | null
	height: number | null
	duration: number | null
	md5: string
	folderId: string | null
	availabilityStartAt: string | null
	availabilityEndAt: string | null
	createdAt: string
	updatedAt: string
	deletedAt: string | null
	uploaderId: string
}

export type Folder = {
	name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    workspaceId: string;
    parentId: string | null;
}

export type ParentFolderTreeResult = {
    id: string
    name: string
    parentId: string | null
}