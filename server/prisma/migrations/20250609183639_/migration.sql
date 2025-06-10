-- AlterTable
ALTER TABLE "File" ADD COLUMN     "folderIdBeforeDeletion" TEXT;

-- AlterTable
ALTER TABLE "Folder" ADD COLUMN     "parentIdBeforeDeletion" TEXT;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_folderIdBeforeDeletion_fkey" FOREIGN KEY ("folderIdBeforeDeletion") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_parentIdBeforeDeletion_fkey" FOREIGN KEY ("parentIdBeforeDeletion") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
