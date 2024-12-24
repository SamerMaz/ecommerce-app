/*
  Warnings:

  - A unique constraint covering the columns `[lineOne,city,state,postalCode,userId]` on the table `addresses` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "addresses_lineOne_city_state_postalCode_userId_key" ON "addresses"("lineOne", "city", "state", "postalCode", "userId");
