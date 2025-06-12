import { createFileUploadSession } from '@modules/workspace/modules/file/controllers/createFileUploadSession.js'
import { uploadFilePart } from '@modules/workspace/modules/file/controllers/uploadFilePart.js'
import { cancelFileUploading } from '@modules/workspace/modules/file/controllers/cancelFileUploading.js'
import { getWorkspaceFiles } from '@modules/workspace/modules/file/controllers/getWorkspaceFiles.js'
import { createFolder } from '@modules/workspace/modules/file/controllers/createFolder.js'
import { getFolder } from '@modules/workspace/modules/file/controllers/getFolder.js'
import { getWorkspaceFolders } from '@modules/workspace/modules/file/controllers/getWorkspaceFolders.js'
import { softDeleteFolders } from '@modules/workspace/modules/file/controllers/softDeleteFolders.js'
import { softDeleteFiles } from '@modules/workspace/modules/file/controllers/softDeleteFiles.js'
import { moveFiles } from '@modules/workspace/modules/file/controllers/moveFiles.js'
import { moveFolders } from '@modules/workspace/modules/file/controllers/moveFolders.js'
import { updateFolder } from '@modules/workspace/modules/file/controllers/updateFolder.js'
import { restoreFiles } from '@modules/workspace/modules/file/controllers/restoreFiles.js'
import { restoreFolders } from '@modules/workspace/modules/file/controllers/restoreFolders.js'
import { emptyTrash } from '@modules/workspace/modules/file/controllers/emptyTrash.js'
import { forceDeleteFiles } from '@modules/workspace/modules/file/controllers/forceDeleteFiles.js'
import { forceDeleteFolders } from '@modules/workspace/modules/file/controllers/forceDeleteFolders.js'

export {
    cancelFileUploading,
    createFileUploadSession,
    createFolder,
    emptyTrash,
    forceDeleteFiles,
    forceDeleteFolders,
    getFolder,
    getWorkspaceFiles,
    getWorkspaceFolders,
    moveFiles,
    moveFolders,
    restoreFiles,
    restoreFolders,
    softDeleteFiles,
    softDeleteFolders,
    updateFolder,
    uploadFilePart
}

export default {
    cancelFileUploading,
    createFileUploadSession,
    createFolder,
    emptyTrash,
    forceDeleteFiles,
    forceDeleteFolders,
    getFolder,
    getWorkspaceFiles,
    getWorkspaceFolders,
    moveFiles,
    moveFolders,
    restoreFiles,
    restoreFolders,
    softDeleteFiles,
    softDeleteFolders,
    updateFolder,
    uploadFilePart
}