/*
  Warnings:

  - You are about to drop the `WorkspaceUserInvitation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."WorkspaceUserInvitation" DROP CONSTRAINT "WorkspaceUserInvitation_invitorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."WorkspaceUserInvitation" DROP CONSTRAINT "WorkspaceUserInvitation_workspaceId_fkey";

-- DropTable
DROP TABLE "public"."WorkspaceUserInvitation";

-- CreateTable
CREATE TABLE "public"."WorkspaceInvitation" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkspaceInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WorkspaceInvitation_email_idx" ON "public"."WorkspaceInvitation"("email");

-- CreateIndex
CREATE INDEX "WorkspaceInvitation_workspaceId_idx" ON "public"."WorkspaceInvitation"("workspaceId");

-- AddForeignKey
ALTER TABLE "public"."WorkspaceInvitation" ADD CONSTRAINT "WorkspaceInvitation_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
