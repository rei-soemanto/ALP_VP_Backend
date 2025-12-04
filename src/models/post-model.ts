import { UserResponse } from "./user-model"

export interface CreatePostRequest {
    caption?: string
    isPublic?: string
}

export interface PostImageResponse {
    imageUrl: string
}

export interface PostResponse {
    id: number
    caption: string | null
    isPublic: boolean
    createdAt: Date
    author: {
        id: number
        fullName: string
    }
    images: { imageUrl: string }[]
    totalLikes: number
    isLiked: boolean
}

export interface UpdatePostRequest {
    caption?: string
    isPublic?: boolean 
}