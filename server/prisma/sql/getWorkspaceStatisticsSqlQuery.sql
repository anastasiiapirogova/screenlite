SELECT (
        SELECT COUNT(*)
        FROM "WorkspaceMember" m
        WHERE m."workspaceId" = w.id
    ) AS "members",
    (
        SELECT COUNT(*)
        FROM "Playlist" p
        WHERE p."workspaceId" = w.id
    ) AS "playlists",
    (
        SELECT COUNT(*)
        FROM "Screen" s
        WHERE s."workspaceId" = w.id
    ) AS "screens",
    (
        SELECT COUNT(*)
        FROM "PlaylistLayout" l
        WHERE l."workspaceId" = w.id
    ) AS "layouts",
    (
        SELECT COUNT(*)
        FROM "File" f
        WHERE f."workspaceId" = w.id
            AND f."forceDeleteRequestedAt" IS NULL
    ) AS "filesActive",
    (
        SELECT COUNT(*)
        FROM "File" f
        WHERE f."workspaceId" = w.id
            AND f."deletedAt" IS NOT NULL
            AND f."forceDeleteRequestedAt" IS NULL
    ) AS "filesTrash",
    (
        SELECT COUNT(*)
        FROM "WorkspaceUserInvitation" ui
        WHERE ui."workspaceId" = w.id
    ) AS "invitationsTotal",
    (
        SELECT COUNT(*)
        FROM "WorkspaceUserInvitation" ui
        WHERE ui."workspaceId" = w.id
            AND ui.status = 'pending'
    ) AS "invitationsPending"
FROM "Workspace" w
WHERE w.id = $1;