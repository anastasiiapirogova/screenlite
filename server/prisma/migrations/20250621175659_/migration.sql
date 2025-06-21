-- AlterTable
ALTER TABLE "File" ALTER COLUMN "processingStatus" DROP NOT NULL,
ALTER COLUMN "processingStatus" DROP DEFAULT;
