import { Request, Response, NextFunction } from "express"
import {
    LoginUserRequest,
    RegisterUserRequest,
    UpdateUserRequest,
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
        } catch (error) { next(new ResponseError(400, "Bad Request!")) }
    }
    
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const request: RegisterUserRequest = req.body as RegisterUserRequest
            const response: UserResponse = await UserService.register(request)

            res.status(200).json({
                data: response,
            })
        } catch (error) {
            next(new ResponseError(400, "Bad Request!"))
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
            next(new ResponseError(400, "Bad Request!"))
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
            next(new ResponseError(400, "Bad Request!"))
        }
    }
}