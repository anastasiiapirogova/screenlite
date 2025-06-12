import { Folder } from '@workspaceModules/file/types'
import { createItemStore } from './utils/createItemStore'

export const useFolderStore = createItemStore<Folder>()