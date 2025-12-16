import { ListMessageRequest, SendMessageRequest, SendMessageResponse } from "../models/chat-message-model";
import { UserJWTPayload } from "../models/user-model";
import { prismaClient } from "../utils/database-util";
import { ChatValidation } from "../validations/chat-validation";
import { Validation } from "../validations/validation";

export class ChatService {
    static async sendMessage(
        user: UserJWTPayload, 
        receiverId: number,
        requestData: SendMessageRequest, 
        images: Express.Multer.File[]
    ): Promise<SendMessageResponse> {
        const validatedRequest = Validation.validate(
            ChatValidation.SEND_MESSAGE, requestData
        );

        const imageRecords = images.map((file) => ({
            imageUrl: `/images/chat-messages/${file.filename}`,
        }));

        const message = await prismaClient.message.create({
            data: {
                receiverId,
                senderId: user.id,
                content: validatedRequest.content,
                images: { create: imageRecords },
                
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

    static async readMessages(user: UserJWTPayload, receiverId: number, request: ListMessageRequest): Promise<any> {
        const validatedRequest = Validation.validate(
            ChatValidation.LIST_MESSAGES, request
        );

        const messages = await prismaClient.message.findMany({
            where: { 
                OR: [
                    { senderId: user.id, receiverId: receiverId },
                    { senderId: receiverId, receiverId: user.id }
                ]
             },
            skip: validatedRequest.chunkIndex * 20,
            take: 20,
            include: {
                images: true,
                sender: true
            }
        });

        await prismaClient.message.updateMany({
            where: { receiverId, senderId: user.id, read: false },
            data: {
                read: true,
            }
        });

        return messages.map(msg => ({
            id: msg.id,
            senderId: msg.senderId,
            receiverId: msg.receiverId,
            content: msg.content,
            timestamp: msg.timestamp,
            images: msg.images.map(img => img.imageUrl),
        }));
    }
}