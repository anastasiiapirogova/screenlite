-- AlterTable
ALTER TABLE "File" ADD COLUMN     "uploadSessionId" TEXT;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_uploadSessionId_fkey" FOREIGN KEY ("uploadSessionId") REFERENCES "FileUploadSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
