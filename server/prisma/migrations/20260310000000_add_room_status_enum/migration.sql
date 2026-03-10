-- CreateEnum
CREATE TYPE "RoomStatus" AS ENUM ('AVAILABLE', 'PROCESS', 'MAINTAIN');

-- AlterTable
ALTER TABLE "Room" ADD COLUMN "status" "RoomStatus" NOT NULL DEFAULT 'AVAILABLE';

-- AlterTable (migrate data then drop old column)
ALTER TABLE "Room" DROP COLUMN "isAvailable";
