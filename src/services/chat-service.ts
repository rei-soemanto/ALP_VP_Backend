import { read } from "fs";
import { Message } from "../../generated/prisma";
import { io } from "../main";
import { ListMessageRequest, SendMessageRequest, SendMessageResponse } from "../models/chat-message-model";
import { UserJWTPayload } from "../models/user-model";
import { prismaClient } from "../utils/database-util";
import { ChatValidation } from "../validations/chat-validation";
import { Validation } from "../validations/validation";
import { ResponseError } from "../error/response-error";
import { validate } from "uuid";
import { request } from "http";

export class ChatService {
    static async sendMessage(
        user: UserJWTPayload, 
        counterPartId: number,
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
                receiverId: counterPartId,
                senderId: user.id,
                content: validatedRequest.content,
                images: { create: imageRecords },
                
            },
            include: { 
                images: true,
            }
        });

        const payload = {
            ...message,
            images: message.images.map(img => img.imageUrl)
        };

        io.to([`user:${counterPartId}`, `user:${user.id}`]).emit("message", payload);
        return payload;
    }

    static async readMessages(user: UserJWTPayload, counterPartId: number): Promise<any> {
        if (user.id === counterPartId) {
            throw new ResponseError(400, "Cannot read messages with yourself");
        }

        if (!ChatValidation.USER_ID_PARAM.safeParse(counterPartId).success) {
            throw new ResponseError(400, "Invalid counterPartId parameter");
        }

        const messages = await prismaClient.message.findMany({
            where: { 
                OR: [
                    { senderId: user.id, receiverId: counterPartId },
                    { senderId: counterPartId, receiverId: user.id }
                ]
            }, 
            include: {
                images: true,
                sender: true
            },
            orderBy: {
                timestamp: 'desc',
            },
        });

        await prismaClient.message.updateMany({
            where: { senderId: counterPartId, read: false },
            data: {
                read: true,
            }
        });

        io.to([`user:${counterPartId}`, `user:${user.id}`]).emit("read");
        return messages.map(msg => ({
            id: msg.id,
            senderId: msg.senderId,
            receiverId: msg.receiverId,
            content: msg.content,
            timestamp: msg.timestamp,
            images: msg.images.map(img => img.imageUrl),
            read: msg.read
        }));
    }

    static async readMessage(user: UserJWTPayload, counterPartId: number, messageId: number): Promise<any> {
        if (user.id === counterPartId) {
            throw new ResponseError(400, "Cannot read messages with yourself");
        }

        if (!ChatValidation.USER_ID_PARAM.safeParse(counterPartId).success) {
            throw new ResponseError(400, "Invalid counterPartId parameter");
        }

        if (!ChatValidation.MESSAGE_ID_PARAM.safeParse(messageId).success) {
            throw new ResponseError(400, "Invalid messageId parameter");
        }

        const message = await prismaClient.message.update({
            where: { id: messageId },
            data: {
                read: true,
            }
        });

        io.to([`user:${counterPartId}`, `user:${user.id}`]).emit("read");
        return message;
    }

    static async getImages(user: UserJWTPayload, counterPartId: number, messageId: number): Promise<string[]> {
        const message = await prismaClient.message.findFirst({
            where: {
                id: messageId,
                OR: [
                    { senderId: user.id, receiverId: counterPartId },
                    { senderId: counterPartId, receiverId: user.id }
                ]
            },
            include: {
                images: true
            }
        });

        return message?.images.map(img => img.imageUrl) || [];
    }

    static async getChatList(user: UserJWTPayload): Promise<any> {
        const messages = await prismaClient.message.findMany({
            where: {
                OR: [
                    { senderId: user.id },
                    { receiverId: user.id }
                ]
            },
            include: {
                sender: true,
                receiver: true
            },
            orderBy: {
                timestamp: 'desc',
            },
        });

        const chats = new Map<number, Message>();

        for (const msg of messages) {
            const otherUserId = msg.senderId === user.id ? msg.receiverId : msg.senderId;

            if (!chats.has(otherUserId)) {
                chats.set(otherUserId, msg);
            }
        }

        return Array.from(chats.values()).map((msg: any) => ({
            id: msg.id,
            content: msg.content,
            sentByYou: msg.senderId === user.id,
            read: msg.read,
            chatProfile: {
                id: msg.senderId === user.id ? msg.receiver.id : msg.sender.id,
                fullName: msg.senderId === user.id ? msg.receiver.fullName : msg.sender.fullName,
                avatarUrl: msg.senderId === user.id ? msg.receiver.avatarUrl : msg.sender.avatarUrl,
            }
        }))
    }   
}