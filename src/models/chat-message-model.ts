import { string } from "zod";

export interface SendMessageRequest {
    chatId: number;
    content: string;
}

export interface SendMessageResponse {
    id: number;
    senderId: number;
    receiverId: number;
    content: string;
    timestamp: Date;
    images: string[];
}

export interface ListMessageRequest {
    chunkIndex: number;
}