-- 1) Add nullable columns first so existing data is not blocked.
ALTER TABLE "Product"
ADD COLUMN "ageId" TEXT,
ADD COLUMN "destinationId" TEXT,
ADD COLUMN "durationId" TEXT;

-- 2) Create lookup tables for the new relations.
CREATE TABLE "Duration" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Duration_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Age" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Age_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Destination" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Destination_pkey" PRIMARY KEY ("id")
);

-- 3) Indexes.
CREATE INDEX "Duration_storeId_idx" ON "Duration"("storeId");
CREATE INDEX "Age_storeId_idx" ON "Age"("storeId");
CREATE INDEX "Destination_storeId_idx" ON "Destination"("storeId");
CREATE INDEX "Product_durationId_idx" ON "Product"("durationId");
CREATE INDEX "Product_ageId_idx" ON "Product"("ageId");
CREATE INDEX "Product_destinationId_idx" ON "Product"("destinationId");

-- 4) Seed per-store defaults and backfill existing products.
WITH store_defaults AS (
    SELECT
        s.id AS "storeId",
        md5(random()::text || clock_timestamp()::text) AS duration_id,
        md5(random()::text || clock_timestamp()::text || 'age') AS age_id,
        md5(random()::text || clock_timestamp()::text || 'dest') AS destination_id
    FROM "Store" s
)
INSERT INTO "Duration" ("id", "storeId", "name", "value", "createdAt", "updatedAt")
SELECT duration_id, "storeId", '1-2', '1-2', NOW(), NOW() FROM store_defaults;

INSERT INTO "Age" ("id", "storeId", "name", "value", "createdAt", "updatedAt")
SELECT age_id, "storeId", 'below5', 'below5', NOW(), NOW() FROM store_defaults;

INSERT INTO "Destination" ("id", "storeId", "name", "value", "createdAt", "updatedAt")
SELECT destination_id, "storeId", 'tirupati', 'tirupati', NOW(), NOW() FROM store_defaults;

UPDATE "Product" p
SET
    "durationId" = sd.duration_id,
    "ageId" = sd.age_id,
    "destinationId" = sd.destination_id
FROM store_defaults sd
WHERE p."storeId" = sd."storeId"
  AND (p."durationId" IS NULL OR p."ageId" IS NULL OR p."destinationId" IS NULL);

-- 5) Enforce NOT NULL now that data is populated.
ALTER TABLE "Product"
ALTER COLUMN "durationId" SET NOT NULL,
ALTER COLUMN "ageId" SET NOT NULL,
ALTER COLUMN "destinationId" SET NOT NULL;
