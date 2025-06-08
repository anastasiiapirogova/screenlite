import { Folder } from '@modules/file/types'
import { createItemStore } from './utils/createItemStore'

export const useFolderStore = createItemStore<Folder>()