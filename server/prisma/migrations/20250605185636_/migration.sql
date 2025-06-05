/*
  Warnings:

  - You are about to drop the column `revokedAt` on the `Session` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Session_revokedAt_idx";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "revokedAt",
ADD COLUMN     "terminatedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Session_terminatedAt_idx" ON "Session"("terminatedAt");
