-- AlterTable
ALTER TABLE "public"."UserCredential" ADD COLUMN     "passwordHash" TEXT,
ADD COLUMN     "passwordUpdatedAt" TIMESTAMP(3);
