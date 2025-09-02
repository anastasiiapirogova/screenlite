/*
  Warnings:

  - You are about to drop the column `invitorUserId` on the `WorkspaceInvitation` table. All the data in the column will be lost.
  - Added the required column `initiatorId` to the `WorkspaceInvitation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."WorkspaceInvitation" DROP CONSTRAINT "WorkspaceInvitation_invitorUserId_fkey";

-- AlterTable
ALTER TABLE "public"."WorkspaceInvitation" DROP COLUMN "invitorUserId",
ADD COLUMN     "initiatorId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."Initiator" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Initiator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Initiator_userId_key" ON "public"."Initiator"("userId");

-- CreateIndex
CREATE INDEX "Initiator_userId_idx" ON "public"."Initiator"("userId");

-- CreateIndex
CREATE INDEX "Initiator_type_idx" ON "public"."Initiator"("type");

-- CreateIndex
CREATE INDEX "WorkspaceInvitation_initiatorId_idx" ON "public"."WorkspaceInvitation"("initiatorId");

-- AddForeignKey
ALTER TABLE "public"."Initiator" ADD CONSTRAINT "Initiator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkspaceInvitation" ADD CONSTRAINT "WorkspaceInvitation_initiatorId_fkey" FOREIGN KEY ("initiatorId") REFERENCES "public"."Initiator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
