/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Keys` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Keys_userId_key" ON "Keys"("userId");
