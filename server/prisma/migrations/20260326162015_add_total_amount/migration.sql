-- AlterTable
ALTER TABLE "BookingRequest" ADD COLUMN     "totalAmount" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "BookingRequestService" (
    "id" TEXT NOT NULL,
    "bookingRequestId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "priceSnapshot" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "BookingRequestService_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BookingRequestService_bookingRequestId_idx" ON "BookingRequestService"("bookingRequestId");

-- CreateIndex
CREATE INDEX "BookingRequestService_serviceId_idx" ON "BookingRequestService"("serviceId");

-- AddForeignKey
ALTER TABLE "BookingRequestService" ADD CONSTRAINT "BookingRequestService_bookingRequestId_fkey" FOREIGN KEY ("bookingRequestId") REFERENCES "BookingRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingRequestService" ADD CONSTRAINT "BookingRequestService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
