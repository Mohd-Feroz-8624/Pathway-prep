/*
  Warnings:

  - A unique constraint covering the columns `[semesterId,slug]` on the table `Subject` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- Add slug as nullable first
ALTER TABLE "Subject" ADD COLUMN "slug" TEXT;

-- Populate slugs for existing subjects
UPDATE "Subject"
SET "slug" = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE("name", '&', 'and', 'g'),
    '[^a-zA-Z0-9]+',
    '-',
    'g'
  )
);

-- Remove leading/trailing hyphens
UPDATE "Subject"
SET "slug" = TRIM(BOTH '-' FROM "slug");

-- Make slug required
ALTER TABLE "Subject"
ALTER COLUMN "slug" SET NOT NULL;

-- Create the unique constraint
CREATE UNIQUE INDEX "Subject_semesterId_slug_key"
ON "Subject"("semesterId", "slug");