import { prismaClient } from "../utils/database-util";
import { Validation } from "../validations/validation";
import { CommentValidation } from "../validations/comment-validation";
import { CreateCommentRequest, CommentResponse } from "../models/comment-model";
import { UserJWTPayload } from "../models/user-model";
import { ResponseError } from "../error/response-error";

export class CommentService {
    
    static async create(
        user: UserJWTPayload,
        postId: number,
        request: CreateCommentRequest
    ): Promise<CommentResponse> {
        
        const validatedRequest = Validation.validate(
            CommentValidation.CREATE,
            request
        );

        const postExists = await prismaClient.post.count({
            where: { id: postId }
        });

        if (postExists === 0) {
            throw new ResponseError(404, "Post not found");
        }

        if (validatedRequest.replyingToId) {
            const parentComment = await prismaClient.comment.findUnique({
                where: { id: validatedRequest.replyingToId }
            });
            
            if (!parentComment) {
                throw new ResponseError(404, "Parent comment not found");
            }
            
            if (parentComment.postId !== postId) {
                throw new ResponseError(400, "Parent comment belongs to a different post");
            }
        }

        const comment = await prismaClient.comment.create({
            data: {
                content: validatedRequest.content,
                postId: postId,
                userId: user.id,
                replyingToId: validatedRequest.replyingToId ?? null
            },
            include: {
                user: true
            }
        });

        return {
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            author: {
                id: comment.user.id,
                fullName: comment.user.fullName
            },
            replyingToId: comment.replyingToId,
            totalReplies: 0
        };
    }

    static async listByPost(postId: number): Promise<CommentResponse[]> {
        const comments = await prismaClient.comment.findMany({
            where: {
                postId: postId,
                replyingToId: null 
            },
            orderBy: { createdAt: "desc" },
            include: {
                user: true,
                _count: { select: { replies: true } },
                replies: {
                    include: {
                        user: true,
                        _count: { select: { replies: true } }
                    },
                    orderBy: { createdAt: "asc" }
                }
            }
        });

        return comments.map(comment => ({
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            author: {
                id: comment.user.id,
                fullName: comment.user.fullName
            },
            replyingToId: null,
            totalReplies: comment._count.replies,
            replies: comment.replies.map(reply => ({
                id: reply.id,
                content: reply.content,
                createdAt: reply.createdAt,
                author: {
                    id: reply.user.id,
                    fullName: reply.user.fullName
                },
                replyingToId: comment.id,
                totalReplies: reply._count.replies
            }))
        }));
    }
}