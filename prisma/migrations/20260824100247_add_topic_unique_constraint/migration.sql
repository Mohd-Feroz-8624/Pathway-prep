/*
  Warnings:

  - A unique constraint covering the columns `[unitId,title]` on the table `Topic` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Topic_unitId_title_key" ON "Topic"("unitId", "title");
