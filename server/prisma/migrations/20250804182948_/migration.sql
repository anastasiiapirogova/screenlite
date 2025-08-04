/*
  Warnings:

  - You are about to drop the column `twoFaVerifiedAt` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `totpSecret` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `twoFactorEnabled` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Session" DROP COLUMN "twoFaVerifiedAt";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "totpSecret",
DROP COLUMN "twoFactorEnabled";

-- CreateTable
CREATE TABLE "public"."TotpConfig" (
    "twoFactorMethodId" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "algorithm" TEXT NOT NULL DEFAULT 'SHA1',
    "digits" INTEGER NOT NULL DEFAULT 6,
    "period" INTEGER NOT NULL DEFAULT 30,

    CONSTRAINT "TotpConfig_pkey" PRIMARY KEY ("twoFactorMethodId")
);

-- CreateTable
CREATE TABLE "public"."TwoFactorMethod" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" TIMESTAMP(3),

    CONSTRAINT "TwoFactorMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TwoFactorRecoveryCode" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "encryptedCode" TEXT NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TwoFactorRecoveryCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TwoFactorMethod_userId_idx" ON "public"."TwoFactorMethod"("userId");

-- CreateIndex
CREATE INDEX "TwoFactorMethod_type_enabled_idx" ON "public"."TwoFactorMethod"("type", "enabled");

-- CreateIndex
CREATE INDEX "TwoFactorRecoveryCode_userId_idx" ON "public"."TwoFactorRecoveryCode"("userId");

-- AddForeignKey
ALTER TABLE "public"."TotpConfig" ADD CONSTRAINT "TotpConfig_twoFactorMethodId_fkey" FOREIGN KEY ("twoFactorMethodId") REFERENCES "public"."TwoFactorMethod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TwoFactorMethod" ADD CONSTRAINT "TwoFactorMethod_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TwoFactorRecoveryCode" ADD CONSTRAINT "TwoFactorRecoveryCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
