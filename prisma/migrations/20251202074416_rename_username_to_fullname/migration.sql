/*
  Warnings:

  - You are about to drop the column `username` on the `users` table. All the data in the column will be lost.
  - Added the required column `fullName` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "username",
ADD COLUMN     "about" TEXT,
ADD COLUMN     "fullName" VARCHAR(100) NOT NULL,
ADD COLUMN     "is_verified" BOOLEAN NOT NULL DEFAULT false;
