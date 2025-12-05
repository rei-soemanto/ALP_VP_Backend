import { prismaClient } from "../utils/database-util"
import { CreatePostRequest, PostResponse, UpdatePostRequest } from "../models/post-model"
import { UserJWTPayload } from "../models/user-model"
import { Validation } from "../validations/validation"
import { PostValidation } from "../validations/post-validation"
import { ResponseError } from "../error/response-error"
import { removeFile } from "../utils/file-util"

export class PostService {
    static async create(
        user: UserJWTPayload,
        request: CreatePostRequest,
        files: Express.Multer.File[]
    ): Promise<PostResponse> {
        const validatedRequest = Validation.validate(
            PostValidation.CREATE,
            request
        )

        if (!files || files.length === 0) {
            throw new ResponseError(400, "At least one image is required")
        }

        const imageRecords = files.map((file) => ({
            imageUrl: `/images/posts/${file.filename}`,
        }))

        const post = await prismaClient.post.create({
            data: {
                caption: validatedRequest.caption,
                isPublic: validatedRequest.isPublic === "true",
                userId: user.id,
                images: {
                    create: imageRecords,
                },
            },
            include: {
                images: true,
                user: true,
            },
        })

        return {
            id: post.id,
            caption: post.caption,
            isPublic: post.isPublic,
            createdAt: post.createdAt,
            author: {
                id: post.user.id,
                fullName: post.user.fullName,
                avatarUrl: post.user.avatarUrl
            },
            images: post.images.map((img) => ({
                imageUrl: img.imageUrl,
            })),
            totalLikes: 0,
            totalComments: 0,
            isLiked: false
        }
    }

    static async listMine(user: UserJWTPayload) {
        const posts = await prismaClient.post.findMany({
            where: {
                userId: user.id 
            },
            orderBy: { createdAt: "desc" },
            include: {
                images: true,
                user: true,
                _count: { 
                    select: { 
                        likes: true, 
                        comments: true
                    } 
                },
                likes: {
                    where: { userId: user.id },
                    select: { userId: true }
                }
            }
        })

        return posts.map((post) => ({
            id: post.id,
            caption: post.caption,
            isPublic: post.isPublic,
            createdAt: post.createdAt,
            author: {
                id: post.user.id,
                fullName: post.user.fullName,
                avatarUrl: post.user.avatarUrl
            },
            images: post.images.map((img) => ({ imageUrl: img.imageUrl })),
            totalLikes: post._count.likes,
            totalComments: post._count.comments,
            isLiked: post.likes.length > 0
        }))
    }

    static async list(user: UserJWTPayload): Promise<PostResponse[]> {
        const posts = await prismaClient.post.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                images: true,
                user: true,
                _count: {
                    select: { 
                        likes: true, 
                        comments: true
                    }
                },
                likes: {
                    where: { userId: user.id },
                    select: { userId: true }
                }
            }
        })

        return posts.map((post) => ({
            id: post.id,
            caption: post.caption,
            isPublic: post.isPublic,
            createdAt: post.createdAt,
            author: {
                id: post.user.id,
                fullName: post.user.fullName,
                avatarUrl: post.user.avatarUrl
            },
            images: post.images.map((img) => ({ imageUrl: img.imageUrl })),
            totalLikes: post._count.likes,
            totalComments: post._count.comments,
            isLiked: post.likes.length > 0
        }))
    }

    static async update(
        user: UserJWTPayload,
        postId: number,
        request: UpdatePostRequest
    ): Promise<PostResponse> {
        
        const validatedRequest = Validation.validate(
            PostValidation.UPDATE,
            request
        )

        const post = await prismaClient.post.findFirst({
            where: {
                id: postId,
                userId: user.id
            }
        })

        if (!post) {
            throw new ResponseError(404, "Post not found or unauthorized")
        }

        const updatedPost = await prismaClient.post.update({
            where: {
                id: postId
            },
            data: {
                caption: validatedRequest.caption,
                isPublic: validatedRequest.isPublic
            },
            include: {
                images: true,
                user: true,
                _count: {
                    select: { 
                        likes: true, 
                        comments: true
                    }
                },
                likes: {
                    where: { userId: user.id },
                    select: { userId: true }
                }
            }
        })

        return {
            id: updatedPost.id,
            caption: updatedPost.caption,
            isPublic: updatedPost.isPublic,
            createdAt: updatedPost.createdAt,
            author: {
                id: updatedPost.user.id,
                fullName: updatedPost.user.fullName,
                avatarUrl: updatedPost.user.avatarUrl
            },
            images: updatedPost.images.map(img => ({
                imageUrl: img.imageUrl
            })),
            totalLikes: updatedPost._count.likes,
            totalComments: updatedPost._count.comments,
            isLiked: updatedPost.likes.length > 0
        }
    }

    static async delete(user: UserJWTPayload, postId: number) {
        const post = await prismaClient.post.findFirst({
            where: { id: postId, userId: user.id },
            include: { images: true }
        })
        if (!post) throw new ResponseError(404, "Post not found or unauthorized")
        post.images.forEach(image => removeFile(image.imageUrl))
        await prismaClient.post.delete({ where: { id: postId } })
        return "Post deleted successfully"
    }

    static async toggleLike(user: UserJWTPayload, postId: number) {
        const postExists = await prismaClient.post.count({ where: { id: postId } })
        if (postExists === 0) throw new ResponseError(404, "Post not found")
        const existingLike = await prismaClient.like.findUnique({
            where: { userId_postId: { userId: user.id, postId: postId } }
        })
        if (existingLike) {
            await prismaClient.like.delete({
                where: { userId_postId: { userId: user.id, postId: postId } }
            })
            return "Unliked"
        } else {
            await prismaClient.like.create({
                data: { userId: user.id, postId: postId }
            })
            return "Liked"
        }
    }
}