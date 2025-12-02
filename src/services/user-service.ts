import { ResponseError } from "../error/response-error"
import {
    LoginUserRequest,
    RegisterUserRequest,
    UpdateUserRequest,
    toUserResponse,
    UserResponse,
    UserJWTPayload,
} from "../models/user-model"
import { prismaClient } from "../utils/database-util"
import { UserValidation } from "../validations/user-validation"
import { Validation } from "../validations/validation"
import bcrypt from "bcrypt"

export class UserService {
    static async register(request: RegisterUserRequest): Promise<UserResponse> {
        const validatedData = Validation.validate(
            UserValidation.REGISTER,
            request
        )

        const email = await prismaClient.user.findFirst({
            where: {
                email: validatedData.email,
            },
        })

        if (email) {
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

        return toUserResponse(user.id, user.fullName, user.email, user.about)
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

        return toUserResponse(user.id, user.fullName, user.email, user.about)
    }

    static async update(
        userPayload: UserJWTPayload, 
        request: UpdateUserRequest
    ): Promise<UserResponse> {
        const validatedData = Validation.validate(
            UserValidation.UPDATE, 
            request
        )

        const userExists = await prismaClient.user.findUnique({
            where: { id: userPayload.id }
        })

        if(!userExists) {
            throw new ResponseError(404, "User not found")
        }

        const updatedUser = await prismaClient.user.update({
            where: {
                id: userPayload.id
            },
            data: validatedData
        })

        return toUserResponse(
            updatedUser.id, 
            updatedUser.fullName, 
            updatedUser.email, 
            updatedUser.about
        )
    }
}