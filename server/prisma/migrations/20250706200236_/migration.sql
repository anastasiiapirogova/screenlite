/*
  Warnings:

  - You are about to drop the column `isOnline` on the `Device` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Device" DROP COLUMN "isOnline",
ADD COLUMN     "onlineAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
