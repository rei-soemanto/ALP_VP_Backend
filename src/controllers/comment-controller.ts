import { Response, NextFunction } from "express";
import { UserRequest } from "../models/user-request-model";
import { CreateCommentRequest } from "../models/comment-model";
import { CommentService } from "../services/comment-service";
import { ResponseError } from "../error/response-error";

export class CommentController {
    
    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const postId = parseInt(req.params.postId);
            const request: CreateCommentRequest = req.body as CreateCommentRequest;

            const response = await CommentService.create(req.user!, postId, request);

            res.status(200).json({
                data: response
            });
        } catch (error) {
            next(new ResponseError(400, "Bad Request!"))
        }
    }

    static async listByPost(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const postId = parseInt(req.params.postId);
            const response = await CommentService.listByPost(postId);

            res.status(200).json({
                data: response
            });
        } catch (error) {
            next(new ResponseError(400, "Bad Request!"))
        }
    }
}