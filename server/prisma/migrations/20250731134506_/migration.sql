-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."AdminApiToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminApiToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WorkspaceApiToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkspaceApiToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminApiToken_token_key" ON "public"."AdminApiToken"("token");

-- CreateIndex
CREATE INDEX "AdminApiToken_userId_idx" ON "public"."AdminApiToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceApiToken_token_key" ON "public"."WorkspaceApiToken"("token");

-- CreateIndex
CREATE INDEX "WorkspaceApiToken_userId_idx" ON "public"."WorkspaceApiToken"("userId");

-- CreateIndex
CREATE INDEX "WorkspaceApiToken_workspaceId_idx" ON "public"."WorkspaceApiToken"("workspaceId");

-- AddForeignKey
ALTER TABLE "public"."AdminApiToken" ADD CONSTRAINT "AdminApiToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkspaceApiToken" ADD CONSTRAINT "WorkspaceApiToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkspaceApiToken" ADD CONSTRAINT "WorkspaceApiToken_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
