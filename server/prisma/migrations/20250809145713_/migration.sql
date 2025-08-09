/*
  Warnings:

  - You are about to drop the column `secret` on the `TotpConfig` table. All the data in the column will be lost.
  - Added the required column `encryptedSecret` to the `TotpConfig` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."TotpConfig" DROP COLUMN "secret",
ADD COLUMN     "encryptedSecret" TEXT NOT NULL;
