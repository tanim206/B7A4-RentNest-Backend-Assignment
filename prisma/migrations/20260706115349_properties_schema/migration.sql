-- CreateEnum
CREATE TYPE "PropertiesStatus" AS ENUM ('AVAILABLE', 'BOOKED', 'RENTED');

-- CreateTable
CREATE TABLE "properties" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "propertyType" VARCHAR(100) NOT NULL,
    "availabilityStatus" "PropertiesStatus" NOT NULL DEFAULT 'AVAILABLE',
    "amenities" TEXT[],
    "landlordId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "properties_landlordId_key" ON "properties"("landlordId");

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_landlordId_fkey" FOREIGN KEY ("landlordId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
