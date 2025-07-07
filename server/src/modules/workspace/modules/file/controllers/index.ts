import { getWorkspaceFiles } from '@/modules/workspace/modules/file/controllers/getWorkspaceFiles.ts'
import { createFolder } from '@workspaceModules/modules/folder/controllers/createFolder.ts'
import { softDeleteFiles } from '@/modules/workspace/modules/file/controllers/softDeleteFiles.ts'
import { moveFiles } from '@/modules/workspace/modules/file/controllers/moveFiles.ts'
import { restoreFiles } from '@/modules/workspace/modules/file/controllers/restoreFiles.ts'
import { emptyTrash } from '@/modules/workspace/modules/file/controllers/emptyTrash.ts'
import { forceDeleteFiles } from '@/modules/workspace/modules/file/controllers/forceDeleteFiles.ts'
import { getFile } from '@/modules/workspace/modules/file/controllers/getFile.ts'
import { getFilePlaylists } from '@/modules/workspace/modules/file/controllers/getFilePlaylists.ts'
import { getWorkspaceSoftDeletedFolders } from '@workspaceModules/modules/folder/controllers/getWorkspaceSoftDeletedFolders.ts'
import { getWorkspaceSoftDeletedFiles } from '@/modules/workspace/modules/file/controllers/getWorkspaceSoftDeletedFiles.ts'

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