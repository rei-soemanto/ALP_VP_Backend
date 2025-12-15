import { string } from "zod";

export interface SendMessageRequest {
    chatId: number;
    content: string;
}

export interface SendMessageResponse {
    id: number;
    chatId: number;
    senderId: number;
    content: string;
    timestamp: Date;
    images: string[];
}

export interface ListMessageRequest {
    chatId: number;
    chunkIndex: number;
}