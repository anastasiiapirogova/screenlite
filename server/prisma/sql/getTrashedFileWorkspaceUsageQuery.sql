SELECT SUM("size") as total
FROM "File"
WHERE "workspaceId" = $1
    AND "deletedAt" IS NOT NULL
    AND "forceDeleteRequestedAt" IS NULL;