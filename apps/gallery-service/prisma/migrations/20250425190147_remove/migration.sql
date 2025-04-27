/*
  Warnings:

  - You are about to drop the column `userId` on the `UserAccess` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email,galleryId]` on the table `UserAccess` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `UserAccess` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "UserAccess_userId_galleryId_key";

-- AlterTable
ALTER TABLE "UserAccess" DROP COLUMN "userId",
ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserAccess_email_galleryId_key" ON "UserAccess"("email", "galleryId");
