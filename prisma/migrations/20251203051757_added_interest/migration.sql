/*
  Warnings:

  - You are about to drop the column `fullName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `is_verified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `users` table. All the data in the column will be lost.
  - Added the required column `full_name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hashed_password` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "fullName",
DROP COLUMN "is_verified",
DROP COLUMN "password",
ADD COLUMN     "full_name" VARCHAR(100) NOT NULL,
ADD COLUMN     "hashed_password" VARCHAR(100) NOT NULL,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "interests" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "interests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_interests" (
    "user_id" INTEGER NOT NULL,
    "interest_id" INTEGER NOT NULL,
    "primary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_interests_pkey" PRIMARY KEY ("user_id","interest_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "interests_name_key" ON "interests"("name");

-- AddForeignKey
ALTER TABLE "users_interests" ADD CONSTRAINT "users_interests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_interests" ADD CONSTRAINT "users_interests_interest_id_fkey" FOREIGN KEY ("interest_id") REFERENCES "interests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
