-- AlterTable
ALTER TABLE "public"."WorkspaceInvitation" ADD COLUMN     "invitorUserId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."WorkspaceInvitation" ADD CONSTRAINT "WorkspaceInvitation_invitorUserId_fkey" FOREIGN KEY ("invitorUserId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
