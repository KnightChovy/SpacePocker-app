/*
  Warnings:

  - Added the required column `managerId` to the `ServiceCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ServiceCategory" ADD COLUMN     "managerId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "RoomServiceCategory" (
    "roomId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoomServiceCategory_pkey" PRIMARY KEY ("roomId","categoryId")
);

-- CreateIndex
CREATE INDEX "RoomServiceCategory_categoryId_idx" ON "RoomServiceCategory"("categoryId");

-- CreateIndex
CREATE INDEX "ServiceCategory_managerId_idx" ON "ServiceCategory"("managerId");

-- AddForeignKey
ALTER TABLE "ServiceCategory" ADD CONSTRAINT "ServiceCategory_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Manager"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomServiceCategory" ADD CONSTRAINT "RoomServiceCategory_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomServiceCategory" ADD CONSTRAINT "RoomServiceCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ServiceCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
