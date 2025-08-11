/*
  Warnings:

  - You are about to drop the column `twoFactorAuthenticatedAt` on the `Session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Session" DROP COLUMN "twoFactorAuthenticatedAt",
ADD COLUMN     "completedTwoFactorAuthAt" TIMESTAMP(3);
