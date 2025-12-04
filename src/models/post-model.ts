import { UserResponse } from "./user-model"

export interface CreatePostRequest {
    title?: string
    caption?: string
    isPublic?: string
}

export interface PostImageResponse {
    imageUrl: string
}

export interface PostResponse {
    id: number
    title: string | null
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
    title?: string
    caption?: string
    isPublic?: boolean 
}