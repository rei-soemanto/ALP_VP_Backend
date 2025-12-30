import { string } from "zod"
import { generateToken } from "../utils/jwt-util"

export interface UserJWTPayload {
    id: number
    fullName: string
    email: string
}

export interface RegisterUserRequest {
    fullName: string
    email: string
    password: string
}

export interface LoginUserRequest {
    email: string
    password: string
}

export interface UpdateUserRequest {
    fullName?: string
    about?: string
    avatarUrl?: string
}

export interface DeleteUserRequest {
    password: string
}

export interface UserResponse {
    token?: string
    id: number
    fullName?: string
    email?: string
    about?: string
    avatarUrl?: string
    postsCount?: number
    followersCount?: number
    followingCount?: number
}

export function toUserResponse(user: any): UserResponse {
    const token = generateToken(
        {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
        },
        "24h"
    )

    const response: UserResponse = {
        token: token,
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        about: user.about,
        avatarUrl: user.avatarUrl,
    }
    
    if (user._count) {
        response.postsCount = user._count.posts
        response.followersCount = user._count.followers
        response.followingCount = user._count.following
    }

    return response
}