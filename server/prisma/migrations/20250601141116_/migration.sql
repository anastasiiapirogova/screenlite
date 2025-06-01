/*
  Warnings:

  - You are about to drop the column `totpVerifiedAt` on the `Session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "totpVerifiedAt",
ADD COLUMN     "twoFaVerifiedAt" TIMESTAMP(3);
