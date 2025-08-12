/*
  Warnings:

  - You are about to drop the column `profilePhoto` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `WorkspaceStorageUsage` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `WorkspaceStorageUsage` table. All the data in the column will be lost.
  - You are about to drop the `UserWorkspace` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."UserWorkspace" DROP CONSTRAINT "UserWorkspace_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserWorkspace" DROP CONSTRAINT "UserWorkspace_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserWorkspace" DROP CONSTRAINT "UserWorkspace_workspaceInvitationId_fkey";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "profilePhoto",
ADD COLUMN     "profilePhotoPath" TEXT;

-- AlterTable
ALTER TABLE "public"."WorkspaceStorageUsage" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- DropTable
DROP TABLE "public"."UserWorkspace";

-- CreateTable
CREATE TABLE "public"."UserWorkspaceRelation" (
    "userId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,

    CONSTRAINT "UserWorkspaceRelation_pkey" PRIMARY KEY ("userId","workspaceId")
);

-- AddForeignKey
ALTER TABLE "public"."UserWorkspaceRelation" ADD CONSTRAINT "UserWorkspaceRelation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserWorkspaceRelation" ADD CONSTRAINT "UserWorkspaceRelation_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
