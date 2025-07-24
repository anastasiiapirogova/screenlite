-- CreateTable
CREATE TABLE "AdminPermission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "AdminPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAdminPermission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,

    CONSTRAINT "UserAdminPermission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminPermission_name_key" ON "AdminPermission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserAdminPermission_userId_permissionId_key" ON "UserAdminPermission"("userId", "permissionId");

-- AddForeignKey
ALTER TABLE "UserAdminPermission" ADD CONSTRAINT "UserAdminPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAdminPermission" ADD CONSTRAINT "UserAdminPermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "AdminPermission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
