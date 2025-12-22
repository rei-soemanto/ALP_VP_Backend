
export interface SendMessageRequest {
    content: string;
}

export interface SendMessageResponse {
    id: number;
    senderId: number;
    receiverId: number;
    content: string;
    timestamp: Date;
    images: string[];
    read: boolean;
}

export interface ListMessageRequest {
    chunkIndex: number;
}