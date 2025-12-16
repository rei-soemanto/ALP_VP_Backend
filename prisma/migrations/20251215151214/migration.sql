/*
  Warnings:

  - You are about to drop the `message_types` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."messages" DROP CONSTRAINT "messages_messageTypeId_fkey";

-- DropTable
DROP TABLE "public"."message_types";

-- CreateTable
CREATE TABLE "message_images" (
    "id" SERIAL NOT NULL,
    "message_id" INTEGER NOT NULL,
    "image_url" VARCHAR(255) NOT NULL,

    CONSTRAINT "message_images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "message_images" ADD CONSTRAINT "message_images_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
