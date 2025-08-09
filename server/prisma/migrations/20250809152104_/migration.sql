/*
  Warnings:

  - You are about to drop the column `twoFaVerifiedAt` on the `Session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Session" DROP COLUMN "twoFaVerifiedAt",
ADD COLUMN     "twoFactorAuthenticatedAt" TIMESTAMP(3);
