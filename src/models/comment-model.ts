import { UserResponse } from "./user-model";

export interface CreateCommentRequest {
    content: string;
    replyingToId?: number;
}

export interface CommentResponse {
    id: number;
    content: string;
    createdAt: Date;
    author: {
        id: number;
        fullName: string;
    };
    replyingToId: number | null;
    totalReplies: number;
    replies?: CommentResponse[];
}