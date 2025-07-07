-- CreateTable
CREATE TABLE "WorkspaceStorageUsage" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "video" BIGINT NOT NULL DEFAULT 0,
    "image" BIGINT NOT NULL DEFAULT 0,
    "audio" BIGINT NOT NULL DEFAULT 0,
    "other" BIGINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkspaceStorageUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceStorageUsage_workspaceId_key" ON "WorkspaceStorageUsage"("workspaceId");

-- AddForeignKey
ALTER TABLE "WorkspaceStorageUsage" ADD CONSTRAINT "WorkspaceStorageUsage_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
