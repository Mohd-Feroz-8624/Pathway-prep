-- CreateTable
CREATE TABLE "RoadmapTaskProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoadmapTaskProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RoadmapTaskProgress_userId_idx" ON "RoadmapTaskProgress"("userId");

-- CreateIndex
CREATE INDEX "RoadmapTaskProgress_taskId_idx" ON "RoadmapTaskProgress"("taskId");

-- CreateIndex
CREATE UNIQUE INDEX "RoadmapTaskProgress_userId_taskId_key" ON "RoadmapTaskProgress"("userId", "taskId");

-- AddForeignKey
ALTER TABLE "RoadmapTaskProgress" ADD CONSTRAINT "RoadmapTaskProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadmapTaskProgress" ADD CONSTRAINT "RoadmapTaskProgress_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "RoadmapTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;
