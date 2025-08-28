/*
  Warnings:

  - You are about to drop the column `picture` on the `Workspace` table. All the data in the column will be lost.
  - Added the required column `role` to the `UserWorkspaceRelation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."UserWorkspaceRelation" ADD COLUMN     "role" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Workspace" DROP COLUMN "picture",
ADD COLUMN     "picturePath" TEXT;

-- AlterTable
ALTER TABLE "public"."WorkspaceUserInvitation" ALTER COLUMN "status" DROP DEFAULT;
