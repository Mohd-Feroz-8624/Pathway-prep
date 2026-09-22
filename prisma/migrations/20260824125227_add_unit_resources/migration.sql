-- CreateTable
CREATE TABLE "UnitResource" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "url" TEXT,
    "unitId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UnitResource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UnitResource_unitId_idx" ON "UnitResource"("unitId");

-- AddForeignKey
ALTER TABLE "UnitResource" ADD CONSTRAINT "UnitResource_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
