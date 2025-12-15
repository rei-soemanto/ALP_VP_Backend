import { ListMessageRequest, SendMessageRequest, SendMessageResponse } from "../models/chat-message-model";
import { UserJWTPayload } from "../models/user-model";
import { prismaClient } from "../utils/database-util";
import { ChatValidation } from "../validations/chat-validation";
import { Validation } from "../validations/validation";

export class ChatService {
    static async sendMessage(
        user: UserJWTPayload, 
        request: SendMessageRequest, 
        images: Express.Multer.File[]
    ): Promise<SendMessageResponse> {
        const validatedRequest = Validation.validate(
            ChatValidation.SEND_MESSAGE, request
        );

        const chat = await prismaClient.chat.findFirstOrThrow({
            where: {
                id: validatedRequest.chatId,
            }
        });

        if (chat.user1Id !== user.id && chat.user2Id !== user.id) {
            throw new Error("User not part of the chat");
        }

        const imageRecords = images.map((file) => ({
            imageUrl: `/images/chat-messages/${file.filename}`,
        }));

        const message = await prismaClient.message.create({
            data: {
                chatId: validatedRequest.chatId,
                senderId: user.id,
                content: validatedRequest.content,
                images: { create: imageRecords }
            },
            include: { 
                images: true,
            }
        });

        return {
            ...message,
            images: message.images.map(img => img.imageUrl)
        };
    }

    static async listMessages(user: UserJWTPayload, request: ListMessageRequest): Promise<any> {
        const validatedRequest = Validation.validate(
            ChatValidation.LIST_MESSAGES, request
        );

        const messages = await prismaClient.message.findMany({
            where: {
                chatId: validatedRequest.chatId
            },
            skip: validatedRequest.chunkIndex * 10,
            take: 10,
            include: {
                images: true,
                sender: true
            }
        });

        return messages;
    }
}