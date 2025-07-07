import { getWorkspaceFiles } from '@/modules/file/controllers/getWorkspaceFiles.ts'
import { createFolder } from '@/modules/folder/controllers/createFolder.ts'
import { softDeleteFiles } from '@/modules/file/controllers/softDeleteFiles.ts'
import { moveFiles } from '@/modules/file/controllers/moveFiles.ts'
import { restoreFiles } from '@/modules/file/controllers/restoreFiles.ts'
import { emptyTrash } from '@/modules/file/controllers/emptyTrash.ts'
import { forceDeleteFiles } from '@/modules/file/controllers/forceDeleteFiles.ts'
import { getFile } from '@/modules/file/controllers/getFile.ts'
import { getFilePlaylists } from '@/modules/file/controllers/getFilePlaylists.ts'
import { getWorkspaceSoftDeletedFolders } from '@/modules/folder/controllers/getWorkspaceSoftDeletedFolders.ts'
import { getWorkspaceSoftDeletedFiles } from '@/modules/file/controllers/getWorkspaceSoftDeletedFiles.ts'

export {
    createFolder,
    emptyTrash,
    forceDeleteFiles,
    getWorkspaceFiles,
    moveFiles,
    restoreFiles,
    softDeleteFiles,
    getFile,
    getFilePlaylists,
    getWorkspaceSoftDeletedFolders,
    getWorkspaceSoftDeletedFiles,
}

export default {
    createFolder,
    emptyTrash,
    forceDeleteFiles,
    getWorkspaceFiles,
    moveFiles,
    restoreFiles,
    softDeleteFiles,
    getFile,
    getFilePlaylists,
    getWorkspaceSoftDeletedFolders,
    getWorkspaceSoftDeletedFiles,
}