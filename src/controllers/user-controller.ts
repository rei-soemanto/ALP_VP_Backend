import { Request, Response, NextFunction } from "express"
import {
    LoginUserRequest,
    RegisterUserRequest,
    UpdateUserRequest,
    DeleteUserRequest,
    UserResponse,
} from "../models/user-model"
import { UserService } from "../services/user-service"
import { UserRequest } from "../models/user-request-model"
import { ResponseError } from "../error/response-error"

export class UserController {
    static async get(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const response = await UserService.get(req.user!)
            res.status(200).json({ data: response })
        } catch (error) { next(error) }
    }
    
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const request: RegisterUserRequest = req.body as RegisterUserRequest
            const response: UserResponse = await UserService.register(request)

            res.status(200).json({
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const request: LoginUserRequest = req.body as LoginUserRequest
            const response: UserResponse = await UserService.login(request)

            res.status(200).json({
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }

    static async update(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: UpdateUserRequest = req.body as UpdateUserRequest
            
            const file = req.file as Express.Multer.File
            if (file) {
                request.avatarUrl = `/images/profiles/${file.filename}`
            }

            const response: UserResponse = await UserService.update(req.user!, request)

            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async delete(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: DeleteUserRequest = req.body as DeleteUserRequest
            const response = await UserService.delete(req.user!, request)
            
            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }
}