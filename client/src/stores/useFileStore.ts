import { WorkspaceFile } from '@modules/file/types'
import { createItemStore } from './utils/createItemStore'

export const useFileStore = createItemStore<WorkspaceFile>()