-- CreateEnum
CREATE TYPE "public"."Weekday" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "public"."LayoutRotation" AS ENUM ('R0', 'R90', 'R180', 'R270');

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
CREATE TABLE "public"."AdminPermission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "AdminPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Device" (
    "id" TEXT NOT NULL,
    "screenId" TEXT,
    "token" TEXT NOT NULL,
    "connectionCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "onlineAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DeviceTelemetry" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "localIpAddress" TEXT,
    "publicIpAddress" TEXT,
    "macAddress" TEXT,
    "softwareVersion" TEXT,
    "platform" TEXT,
    "osRelease" TEXT,
    "screenResolutionWidth" INTEGER,
    "screenResolutionHeight" INTEGER,
    "hostname" TEXT,
    "timezone" TEXT,
    "totalMemory" BIGINT,
    "freeMemory" BIGINT,
    "totalStorage" BIGINT,
    "freeStorage" BIGINT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeviceTelemetry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EmailVerificationToken" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "newEmail" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailVerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."File" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "extension" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "previewPath" TEXT,
    "size" BIGINT NOT NULL,
    "type" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "duration" INTEGER,
    "defaultDuration" INTEGER,
    "videoBitrate" INTEGER,
    "audioBitrate" INTEGER,
    "videoFrameRate" DOUBLE PRECISION,
    "codec" TEXT,
    "processingStatus" TEXT,
    "folderId" TEXT,
    "folderIdBeforeDeletion" TEXT,
    "availabilityStartAt" TIMESTAMP(3),
    "availabilityEndAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "forceDeleteRequestedAt" TIMESTAMP(3),
    "uploaderId" TEXT,
    "uploadSessionId" TEXT,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FileUploadSession" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "size" BIGINT NOT NULL,
    "uploaded" BIGINT NOT NULL DEFAULT 0,
    "uploadedParts" INTEGER NOT NULL DEFAULT 0,
    "mimeType" TEXT NOT NULL DEFAULT 'application/octet-stream',
    "workspaceId" TEXT NOT NULL,
    "uploadId" TEXT,
    "folderId" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),

    CONSTRAINT "FileUploadSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Folder" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "parentId" TEXT,
    "parentIdBeforeDeletion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Link" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "defaultDuration" INTEGER,
    "availabilityStartAt" TIMESTAMP(3),
    "availabilityEndAt" TIMESTAMP(3),
    "streamType" TEXT,
    "refreshInterval" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "addedById" TEXT,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PasswordResetToken" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Playlist" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "playlistLayoutId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "size" BIGINT NOT NULL DEFAULT 0,
    "type" TEXT NOT NULL DEFAULT 'standard',
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Playlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PlaylistItem" (
    "id" TEXT NOT NULL,
    "playlistId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "duration" INTEGER,
    "playlistLayoutSectionId" TEXT NOT NULL,
    "fileId" TEXT,
    "linkId" TEXT,
    "nestedPlaylistId" TEXT,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlaylistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PlaylistLayout" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "resolutionWidth" INTEGER NOT NULL,
    "resolutionHeight" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlaylistLayout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PlaylistLayoutSection" (
    "id" TEXT NOT NULL,
    "playlistLayoutId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "top" INTEGER NOT NULL,
    "left" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "zIndex" INTEGER NOT NULL,

    CONSTRAINT "PlaylistLayoutSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PlaylistSchedule" (
    "id" TEXT NOT NULL,
    "playlistId" TEXT NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3),
    "startTime" TEXT,
    "endTime" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "weekdays" "public"."Weekday"[],

    CONSTRAINT "PlaylistSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PlaylistScreen" (
    "playlistId" TEXT NOT NULL,
    "screenId" TEXT NOT NULL,

    CONSTRAINT "PlaylistScreen_pkey" PRIMARY KEY ("playlistId","screenId")
);

-- CreateTable
CREATE TABLE "public"."Screen" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "groupId" TEXT,
    "name" TEXT NOT NULL,
    "layoutRotation" "public"."LayoutRotation" NOT NULL DEFAULT 'R0',
    "resolutionWidth" INTEGER NOT NULL,
    "resolutionHeight" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Screen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ScreenGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ScreenGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "terminatedAt" TIMESTAMP(3),
    "terminationReason" TEXT,
    "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedTwoFactorAuthAt" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Setting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'string',
    "category" TEXT NOT NULL,
    "isEncrypted" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TotpConfig" (
    "twoFactorMethodId" TEXT NOT NULL,
    "encryptedSecret" TEXT NOT NULL,
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
    "isTotp" BOOLEAN NOT NULL DEFAULT false,

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

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "pendingEmail" TEXT,
    "emailVerifiedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "profilePhotoPath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletionRequestedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserAdminPermission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,

    CONSTRAINT "UserAdminPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserCredential" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "passwordHash" TEXT,
    "passwordUpdatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserCredential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserPreferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserWorkspaceRelation" (
    "userId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,

    CONSTRAINT "UserWorkspaceRelation_pkey" PRIMARY KEY ("userId","workspaceId")
);

-- CreateTable
CREATE TABLE "public"."Workspace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "picture" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
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

-- CreateTable
CREATE TABLE "public"."WorkspaceStorageUsage" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "video" BIGINT NOT NULL DEFAULT 0,
    "image" BIGINT NOT NULL DEFAULT 0,
    "audio" BIGINT NOT NULL DEFAULT 0,
    "other" BIGINT NOT NULL DEFAULT 0,
    "trash" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "WorkspaceStorageUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WorkspaceUserInvitation" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "workspaceId" TEXT NOT NULL,
    "invitorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkspaceUserInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminApiToken_token_key" ON "public"."AdminApiToken"("token");

-- CreateIndex
CREATE INDEX "AdminApiToken_userId_idx" ON "public"."AdminApiToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminPermission_name_key" ON "public"."AdminPermission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Device_screenId_key" ON "public"."Device"("screenId");

-- CreateIndex
CREATE UNIQUE INDEX "Device_token_key" ON "public"."Device"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Device_connectionCode_key" ON "public"."Device"("connectionCode");

-- CreateIndex
CREATE INDEX "Device_token_idx" ON "public"."Device"("token");

-- CreateIndex
CREATE INDEX "Device_connectionCode_idx" ON "public"."Device"("connectionCode");

-- CreateIndex
CREATE INDEX "Device_screenId_idx" ON "public"."Device"("screenId");

-- CreateIndex
CREATE INDEX "Device_onlineAt_idx" ON "public"."Device"("onlineAt");

-- CreateIndex
CREATE INDEX "DeviceTelemetry_deviceId_idx" ON "public"."DeviceTelemetry"("deviceId");

-- CreateIndex
CREATE UNIQUE INDEX "EmailVerificationToken_tokenHash_key" ON "public"."EmailVerificationToken"("tokenHash");

-- CreateIndex
CREATE INDEX "EmailVerificationToken_userId_type_idx" ON "public"."EmailVerificationToken"("userId", "type");

-- CreateIndex
CREATE INDEX "EmailVerificationToken_expiresAt_idx" ON "public"."EmailVerificationToken"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "File_path_key" ON "public"."File"("path");

-- CreateIndex
CREATE INDEX "File_workspaceId_idx" ON "public"."File"("workspaceId");

-- CreateIndex
CREATE INDEX "File_folderId_idx" ON "public"."File"("folderId");

-- CreateIndex
CREATE INDEX "File_uploaderId_idx" ON "public"."File"("uploaderId");

-- CreateIndex
CREATE INDEX "File_deletedAt_idx" ON "public"."File"("deletedAt");

-- CreateIndex
CREATE INDEX "File_name_idx" ON "public"."File"("name");

-- CreateIndex
CREATE INDEX "File_forceDeleteRequestedAt_idx" ON "public"."File"("forceDeleteRequestedAt");

-- CreateIndex
CREATE INDEX "File_folderIdBeforeDeletion_idx" ON "public"."File"("folderIdBeforeDeletion");

-- CreateIndex
CREATE INDEX "Folder_name_idx" ON "public"."Folder"("name");

-- CreateIndex
CREATE INDEX "Folder_workspaceId_idx" ON "public"."Folder"("workspaceId");

-- CreateIndex
CREATE INDEX "Folder_parentId_idx" ON "public"."Folder"("parentId");

-- CreateIndex
CREATE INDEX "Folder_parentIdBeforeDeletion_idx" ON "public"."Folder"("parentIdBeforeDeletion");

-- CreateIndex
CREATE INDEX "Folder_deletedAt_idx" ON "public"."Folder"("deletedAt");

-- CreateIndex
CREATE INDEX "Link_workspaceId_idx" ON "public"."Link"("workspaceId");

-- CreateIndex
CREATE INDEX "Link_addedById_idx" ON "public"."Link"("addedById");

-- CreateIndex
CREATE INDEX "Link_deletedAt_idx" ON "public"."Link"("deletedAt");

-- CreateIndex
CREATE INDEX "Link_name_idx" ON "public"."Link"("name");

-- CreateIndex
CREATE INDEX "Link_type_idx" ON "public"."Link"("type");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key" ON "public"."PasswordResetToken"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_userId_key" ON "public"."PasswordResetToken"("userId");

-- CreateIndex
CREATE INDEX "Playlist_workspaceId_idx" ON "public"."Playlist"("workspaceId");

-- CreateIndex
CREATE INDEX "Playlist_playlistLayoutId_idx" ON "public"."Playlist"("playlistLayoutId");

-- CreateIndex
CREATE INDEX "Playlist_name_idx" ON "public"."Playlist"("name");

-- CreateIndex
CREATE INDEX "Playlist_type_idx" ON "public"."Playlist"("type");

-- CreateIndex
CREATE INDEX "Playlist_isPublished_idx" ON "public"."Playlist"("isPublished");

-- CreateIndex
CREATE INDEX "Playlist_priority_idx" ON "public"."Playlist"("priority");

-- CreateIndex
CREATE INDEX "Playlist_deletedAt_idx" ON "public"."Playlist"("deletedAt");

-- CreateIndex
CREATE INDEX "PlaylistItem_playlistId_idx" ON "public"."PlaylistItem"("playlistId");

-- CreateIndex
CREATE INDEX "PlaylistItem_fileId_idx" ON "public"."PlaylistItem"("fileId");

-- CreateIndex
CREATE INDEX "PlaylistItem_linkId_idx" ON "public"."PlaylistItem"("linkId");

-- CreateIndex
CREATE INDEX "PlaylistItem_nestedPlaylistId_idx" ON "public"."PlaylistItem"("nestedPlaylistId");

-- CreateIndex
CREATE INDEX "PlaylistItem_playlistLayoutSectionId_idx" ON "public"."PlaylistItem"("playlistLayoutSectionId");

-- CreateIndex
CREATE INDEX "PlaylistLayout_name_idx" ON "public"."PlaylistLayout"("name");

-- CreateIndex
CREATE INDEX "PlaylistSchedule_playlistId_idx" ON "public"."PlaylistSchedule"("playlistId");

-- CreateIndex
CREATE INDEX "Screen_workspaceId_idx" ON "public"."Screen"("workspaceId");

-- CreateIndex
CREATE INDEX "Screen_groupId_idx" ON "public"."Screen"("groupId");

-- CreateIndex
CREATE INDEX "ScreenGroup_workspaceId_idx" ON "public"."ScreenGroup"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "public"."Session"("tokenHash");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "public"."Session"("userId");

-- CreateIndex
CREATE INDEX "Session_terminatedAt_idx" ON "public"."Session"("terminatedAt");

-- CreateIndex
CREATE INDEX "Setting_key_idx" ON "public"."Setting"("key");

-- CreateIndex
CREATE INDEX "Setting_category_idx" ON "public"."Setting"("category");

-- CreateIndex
CREATE INDEX "Setting_type_idx" ON "public"."Setting"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Setting_key_category_key" ON "public"."Setting"("key", "category");

-- CreateIndex
CREATE INDEX "TwoFactorMethod_userId_type_idx" ON "public"."TwoFactorMethod"("userId", "type");

-- CreateIndex
CREATE INDEX "TwoFactorMethod_userId_idx" ON "public"."TwoFactorMethod"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TwoFactorMethod_userId_isTotp_key" ON "public"."TwoFactorMethod"("userId", "isTotp");

-- CreateIndex
CREATE INDEX "TwoFactorRecoveryCode_userId_idx" ON "public"."TwoFactorRecoveryCode"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_pendingEmail_key" ON "public"."User"("pendingEmail");

-- CreateIndex
CREATE UNIQUE INDEX "UserAdminPermission_userId_permissionId_key" ON "public"."UserAdminPermission"("userId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPreferences_userId_key" ON "public"."UserPreferences"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_slug_key" ON "public"."Workspace"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceApiToken_token_key" ON "public"."WorkspaceApiToken"("token");

-- CreateIndex
CREATE INDEX "WorkspaceApiToken_userId_idx" ON "public"."WorkspaceApiToken"("userId");

-- CreateIndex
CREATE INDEX "WorkspaceApiToken_workspaceId_idx" ON "public"."WorkspaceApiToken"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceStorageUsage_workspaceId_key" ON "public"."WorkspaceStorageUsage"("workspaceId");

-- CreateIndex
CREATE INDEX "WorkspaceUserInvitation_email_idx" ON "public"."WorkspaceUserInvitation"("email");

-- CreateIndex
CREATE INDEX "WorkspaceUserInvitation_workspaceId_idx" ON "public"."WorkspaceUserInvitation"("workspaceId");

-- AddForeignKey
ALTER TABLE "public"."AdminApiToken" ADD CONSTRAINT "AdminApiToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Device" ADD CONSTRAINT "Device_screenId_fkey" FOREIGN KEY ("screenId") REFERENCES "public"."Screen"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DeviceTelemetry" ADD CONSTRAINT "DeviceTelemetry_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "public"."Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EmailVerificationToken" ADD CONSTRAINT "EmailVerificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."File" ADD CONSTRAINT "File_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "public"."Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."File" ADD CONSTRAINT "File_folderIdBeforeDeletion_fkey" FOREIGN KEY ("folderIdBeforeDeletion") REFERENCES "public"."Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."File" ADD CONSTRAINT "File_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."File" ADD CONSTRAINT "File_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."File" ADD CONSTRAINT "File_uploadSessionId_fkey" FOREIGN KEY ("uploadSessionId") REFERENCES "public"."FileUploadSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FileUploadSession" ADD CONSTRAINT "FileUploadSession_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "public"."Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FileUploadSession" ADD CONSTRAINT "FileUploadSession_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FileUploadSession" ADD CONSTRAINT "FileUploadSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Folder" ADD CONSTRAINT "Folder_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Folder" ADD CONSTRAINT "Folder_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Folder" ADD CONSTRAINT "Folder_parentIdBeforeDeletion_fkey" FOREIGN KEY ("parentIdBeforeDeletion") REFERENCES "public"."Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Link" ADD CONSTRAINT "Link_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Link" ADD CONSTRAINT "Link_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Playlist" ADD CONSTRAINT "Playlist_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Playlist" ADD CONSTRAINT "Playlist_playlistLayoutId_fkey" FOREIGN KEY ("playlistLayoutId") REFERENCES "public"."PlaylistLayout"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlaylistItem" ADD CONSTRAINT "PlaylistItem_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "public"."Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlaylistItem" ADD CONSTRAINT "PlaylistItem_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "public"."File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlaylistItem" ADD CONSTRAINT "PlaylistItem_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "public"."Link"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlaylistItem" ADD CONSTRAINT "PlaylistItem_nestedPlaylistId_fkey" FOREIGN KEY ("nestedPlaylistId") REFERENCES "public"."Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlaylistItem" ADD CONSTRAINT "PlaylistItem_playlistLayoutSectionId_fkey" FOREIGN KEY ("playlistLayoutSectionId") REFERENCES "public"."PlaylistLayoutSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlaylistLayout" ADD CONSTRAINT "PlaylistLayout_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlaylistLayoutSection" ADD CONSTRAINT "PlaylistLayoutSection_playlistLayoutId_fkey" FOREIGN KEY ("playlistLayoutId") REFERENCES "public"."PlaylistLayout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlaylistSchedule" ADD CONSTRAINT "PlaylistSchedule_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "public"."Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlaylistScreen" ADD CONSTRAINT "PlaylistScreen_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "public"."Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlaylistScreen" ADD CONSTRAINT "PlaylistScreen_screenId_fkey" FOREIGN KEY ("screenId") REFERENCES "public"."Screen"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Screen" ADD CONSTRAINT "Screen_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Screen" ADD CONSTRAINT "Screen_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."ScreenGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ScreenGroup" ADD CONSTRAINT "ScreenGroup_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TotpConfig" ADD CONSTRAINT "TotpConfig_twoFactorMethodId_fkey" FOREIGN KEY ("twoFactorMethodId") REFERENCES "public"."TwoFactorMethod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TwoFactorMethod" ADD CONSTRAINT "TwoFactorMethod_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TwoFactorRecoveryCode" ADD CONSTRAINT "TwoFactorRecoveryCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserAdminPermission" ADD CONSTRAINT "UserAdminPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserAdminPermission" ADD CONSTRAINT "UserAdminPermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "public"."AdminPermission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserCredential" ADD CONSTRAINT "UserCredential_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserPreferences" ADD CONSTRAINT "UserPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserWorkspaceRelation" ADD CONSTRAINT "UserWorkspaceRelation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserWorkspaceRelation" ADD CONSTRAINT "UserWorkspaceRelation_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkspaceApiToken" ADD CONSTRAINT "WorkspaceApiToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkspaceApiToken" ADD CONSTRAINT "WorkspaceApiToken_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkspaceStorageUsage" ADD CONSTRAINT "WorkspaceStorageUsage_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkspaceUserInvitation" ADD CONSTRAINT "WorkspaceUserInvitation_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkspaceUserInvitation" ADD CONSTRAINT "WorkspaceUserInvitation_invitorId_fkey" FOREIGN KEY ("invitorId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
