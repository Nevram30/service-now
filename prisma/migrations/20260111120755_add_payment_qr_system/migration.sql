-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'CUSTOMER_MARKED_PAID', 'PROVIDER_CONFIRMED');

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'ADMIN';

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "paymentNotes" TEXT,
ADD COLUMN     "paymentQrCode" TEXT;

-- CreateIndex
CREATE INDEX "Booking_paymentStatus_idx" ON "Booking"("paymentStatus");
