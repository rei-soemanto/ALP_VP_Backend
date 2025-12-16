-- CreateIndex
CREATE INDEX "messages_sender_id_timestamp_idx" ON "messages"("sender_id", "timestamp");

-- CreateIndex
CREATE INDEX "messages_receiver_id_timestamp_idx" ON "messages"("receiver_id", "timestamp");
