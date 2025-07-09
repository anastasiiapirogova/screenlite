/*
  Warnings:

  - You are about to drop the column `streamQuality` on the `Link` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Workspace_slug_idx";

-- AlterTable
ALTER TABLE "Link" DROP COLUMN "streamQuality";

-- AlterTable
ALTER TABLE "WorkspaceStorageUsage" ADD COLUMN     "trash" BIGINT NOT NULL DEFAULT 0;
