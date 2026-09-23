/*
  Warnings:

  - You are about to drop the column `price` on the `Patient` table. All the data in the column will be lost.
  - Added the required column `totalPrice` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- Rename existing price column to totalPrice
ALTER TABLE "Patient" RENAME COLUMN "price" TO "totalPrice";

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "patientId" INTEGER NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
