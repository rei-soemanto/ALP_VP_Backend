/*
  Warnings:

  - You are about to drop the column `user1Id` on the `chats` table. All the data in the column will be lost.
  - You are about to drop the column `user2Id` on the `chats` table. All the data in the column will be lost.
  - You are about to drop the column `chatId` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `messageTypeId` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `messages` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id_1,user_id_2]` on the table `chats` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id_1` to the `chats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id_2` to the `chats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chat_id` to the `messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender_id` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."chats" DROP CONSTRAINT "chats_user1Id_fkey";

-- DropForeignKey
ALTER TABLE "public"."chats" DROP CONSTRAINT "chats_user2Id_fkey";

-- DropForeignKey
ALTER TABLE "public"."messages" DROP CONSTRAINT "messages_chatId_fkey";

-- DropForeignKey
ALTER TABLE "public"."messages" DROP CONSTRAINT "messages_senderId_fkey";

-- DropIndex
DROP INDEX "public"."chats_user1Id_user2Id_key";

-- AlterTable
ALTER TABLE "chats" DROP COLUMN "user1Id",
DROP COLUMN "user2Id",
ADD COLUMN     "user_id_1" INTEGER NOT NULL,
ADD COLUMN     "user_id_2" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "chatId",
DROP COLUMN "messageTypeId",
DROP COLUMN "senderId",
ADD COLUMN     "chat_id" INTEGER NOT NULL,
ADD COLUMN     "sender_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "chats_user_id_1_user_id_2_key" ON "chats"("user_id_1", "user_id_2");

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_user_id_1_fkey" FOREIGN KEY ("user_id_1") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_user_id_2_fkey" FOREIGN KEY ("user_id_2") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
