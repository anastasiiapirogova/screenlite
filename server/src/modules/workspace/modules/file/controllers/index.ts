import { getWorkspaceFiles } from '@/modules/workspace/modules/file/controllers/getWorkspaceFiles.ts'
import { createFolder } from '@/modules/workspace/modules/file/controllers/createFolder.ts'
import { getFolder } from '@/modules/workspace/modules/file/controllers/getFolder.ts'
import { getWorkspaceFolders } from '@/modules/workspace/modules/file/controllers/getWorkspaceFolders.ts'
import { softDeleteFolders } from '@/modules/workspace/modules/file/controllers/softDeleteFolders.ts'
import { softDeleteFiles } from '@/modules/workspace/modules/file/controllers/softDeleteFiles.ts'
import { moveFiles } from '@/modules/workspace/modules/file/controllers/moveFiles.ts'
import { moveFolders } from '@/modules/workspace/modules/file/controllers/moveFolders.ts'
import { updateFolder } from '@/modules/workspace/modules/file/controllers/updateFolder.ts'
import { restoreFiles } from '@/modules/workspace/modules/file/controllers/restoreFiles.ts'
import { restoreFolders } from '@/modules/workspace/modules/file/controllers/restoreFolders.ts'
import { emptyTrash } from '@/modules/workspace/modules/file/controllers/emptyTrash.ts'
import { forceDeleteFiles } from '@/modules/workspace/modules/file/controllers/forceDeleteFiles.ts'
import { forceDeleteFolders } from '@/modules/workspace/modules/file/controllers/forceDeleteFolders.ts'

export {
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
}

export default {
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
}