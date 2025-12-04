import { Response, NextFunction } from "express"
import { UserRequest } from "../models/user-request-model"
import { CreatePostRequest } from "../models/post-model"
import { UpdatePostRequest } from "../models/post-model"
import { PostService } from "../services/post-service"

export class PostController {
    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: CreatePostRequest = req.body as CreatePostRequest
            const files = req.files as Express.Multer.File[]

            const response = await PostService.create(req.user!, request, files)

            res.status(200).json({
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }

    static async listMine(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const response = await PostService.listMine(req.user!)
            res.status(200).json({ data: response })
        } catch (error) { next(error) }
    }

    static async list(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const response = await PostService.list(req.user!)
            res.status(200).json({
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }

    static async update(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const postId = parseInt(req.params.postId)
            const request: UpdatePostRequest = req.body as UpdatePostRequest
            
            const response = await PostService.update(req.user!, postId, request)

            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async delete(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const postId = parseInt(req.params.postId)
            const response = await PostService.delete(req.user!, postId)
            res.status(200).json({ data: response })
        } catch (error) {
            next(error)
        }
    }

    static async toggleLike(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const postId = parseInt(req.params.postId)
            const response = await PostService.toggleLike(req.user!, postId)
            res.status(200).json({ data: response })
        } catch (error) {
            next(error)
        }
    }
}