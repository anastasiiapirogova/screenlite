/*
  Warnings:

  - You are about to drop the column `path` on the `Link` table. All the data in the column will be lost.
  - Added the required column `type` to the `Link` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Link` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_folderId_fkey";

-- AlterTable
ALTER TABLE "Link" DROP COLUMN "path",
ADD COLUMN     "refreshInterval" INTEGER,
ADD COLUMN     "streamQuality" TEXT,
ADD COLUMN     "streamType" TEXT,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL,
ALTER COLUMN "deletedAt" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "Link_type_idx" ON "Link"("type");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
