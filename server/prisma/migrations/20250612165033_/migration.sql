-- AlterTable
ALTER TABLE "PlaylistItem" ADD COLUMN     "linkId" TEXT;

-- CreateTable
CREATE TABLE "Link" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "defaultDuration" INTEGER,
    "availabilityStartAt" TIMESTAMP(3),
    "availabilityEndAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "addedById" TEXT,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Link_workspaceId_idx" ON "Link"("workspaceId");

-- CreateIndex
CREATE INDEX "Link_addedById_idx" ON "Link"("addedById");

-- CreateIndex
CREATE INDEX "Link_deletedAt_idx" ON "Link"("deletedAt");

-- CreateIndex
CREATE INDEX "Link_name_idx" ON "Link"("name");

-- CreateIndex
CREATE INDEX "PlaylistItem_linkId_idx" ON "PlaylistItem"("linkId");

-- CreateIndex
CREATE INDEX "PlaylistItem_nestedPlaylistId_idx" ON "PlaylistItem"("nestedPlaylistId");

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistItem" ADD CONSTRAINT "PlaylistItem_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE CASCADE ON UPDATE CASCADE;
