import { ResponseError } from "../error/response-error"
import {
    LoginUserRequest,
    RegisterUserRequest,
    UpdateUserRequest,
    DeleteUserRequest,
    toUserResponse,
    UserResponse,
    UserJWTPayload,
} from "../models/user-model"
import { prismaClient } from "../utils/database-util"
import { removeFile } from "../utils/file-util"
import { UserValidation } from "../validations/user-validation"
import { Validation } from "../validations/validation"
import bcrypt from "bcrypt"

export class UserService {
    static async register(request: RegisterUserRequest): Promise<UserResponse> {
        const validatedData = Validation.validate(
            UserValidation.REGISTER,
            request
        )

        const existingUser = await prismaClient.user.findFirst({
            where: {
                email: validatedData.email,
            },
        })

        if (existingUser) {
            throw new ResponseError(400, "Email has already existed!")
        }

        validatedData.password = await bcrypt.hash(validatedData.password, 10)

        const user = await prismaClient.user.create({
            data: {
                fullName: validatedData.fullName,
                email: validatedData.email,
                password: validatedData.password,
            },
        })

        return toUserResponse(user)
    }

    static async login(request: LoginUserRequest): Promise<UserResponse> {
        const validatedData = Validation.validate(UserValidation.LOGIN, request)

        const user = await prismaClient.user.findFirst({
            where: {
                email: validatedData.email,
            },
        })

        if (!user) {
            throw new ResponseError(400, "Invalid email or password!")
        }

        const passwordIsValid = await bcrypt.compare(
            validatedData.password,
            user.password
        )

        if (!passwordIsValid) {
            throw new ResponseError(400, "Invalid email or password!")
        }

        return toUserResponse(user)
    }

    static async update(
        userPayload: UserJWTPayload, 
        request: UpdateUserRequest
    ): Promise<UserResponse> {
        const validatedData = Validation.validate(
            UserValidation.UPDATE, 
            request
        )

        const existingUser = await prismaClient.user.findUnique({
            where: { id: userPayload.id }
        })

        if(!existingUser) {
            throw new ResponseError(404, "User not found")
        }

        if (request.avatarUrl && existingUser.avatarUrl) {
            removeFile(existingUser.avatarUrl)
        }

        const updateData = {
            ...validatedData,
            ...(request.avatarUrl ? { avatarUrl: request.avatarUrl } : {})
        }

        const updatedUser = await prismaClient.user.update({
            where: {
                id: userPayload.id
            },
            data: updateData
        })

        return toUserResponse(updatedUser)
    }
    
    static async get(user: UserJWTPayload): Promise<UserResponse> {
        const userData = await prismaClient.user.findUnique({
            where: { id: user.id },
            include: {
                _count: {
                    select: {
                        posts: true,
                        followers: true,
                        following: true
                    }
                }
            }
        })

        if (!userData) {
            throw new ResponseError(404, "User not found")
        }

        return toUserResponse(userData)
    }

    static async delete(
        userPayload: UserJWTPayload, 
        request: DeleteUserRequest
    ): Promise<string> {
        const validatedRequest = Validation.validate(
            UserValidation.DELETE,
            request
        )

        const existingUser = await prismaClient.user.findUnique({
            where: { id: userPayload.id }
        })

        if (!existingUser) {
            throw new ResponseError(404, "User not found")
        }

        const passwordIsValid = await bcrypt.compare(
            validatedRequest.password,
            existingUser.password
        )

        if (!passwordIsValid) {
            throw new ResponseError(401, "Invalid password confirmation!")
        }

        if (existingUser.avatarUrl) {
            removeFile(existingUser.avatarUrl)
        }

        await prismaClient.user.delete({
            where: { id: userPayload.id }
        })

        return "OK"
    }
}