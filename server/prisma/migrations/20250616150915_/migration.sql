/*
  Warnings:

  - You are about to drop the column `parts` on the `FileUploadSession` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "FileUploadSession" DROP CONSTRAINT "FileUploadSession_userId_fkey";

-- AlterTable
ALTER TABLE "File" ALTER COLUMN "processingStatus" SET DEFAULT 'processing';

-- AlterTable
ALTER TABLE "FileUploadSession" DROP COLUMN "parts",
ADD COLUMN     "uploadedParts" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "FileUploadSession" ADD CONSTRAINT "FileUploadSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
