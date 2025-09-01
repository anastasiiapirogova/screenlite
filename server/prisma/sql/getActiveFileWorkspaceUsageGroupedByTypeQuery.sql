SELECT "type",
    SUM("size") as total
FROM "File"
WHERE "workspaceId" = $1
    AND "deletedAt" IS NULL
    AND "forceDeleteRequestedAt" IS NULL
    AND "type" IN ('video', 'image', 'audio')
GROUP BY "type";