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
}

export interface UserResponse {
    token?: string
    fullName?: string
    email?: string
    about?: string
}

export function toUserResponse(
    id: number,
    fullName: string,
    email: string,
    about?: string | null
): UserResponse {
    const response: UserResponse = {
        token: generateToken(
            {
                id: id,
                fullName: fullName,
                email: email,
            },
            "1h"
        ),
        fullName: fullName,
        email: email,
    }

    if (about) {
        response.about = about;
    }

    return response;
}