SELECT COUNT(
        CASE
            WHEN d."onlineAt" >= NOW() - INTERVAL '2 minutes' THEN 1
        END
    ) AS "online",
    COUNT(
        CASE
            WHEN d."onlineAt" < NOW() - INTERVAL '2 minutes' THEN 1
        END
    ) AS "offline",
    COUNT(
        CASE
            WHEN d."screenId" IS NULL THEN 1
        END
    ) AS "notConnected"
FROM "Screen" s
    LEFT JOIN "Device" d ON s."id" = d."screenId"
WHERE s."workspaceId" = $1;