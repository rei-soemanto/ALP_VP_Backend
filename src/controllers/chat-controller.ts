import { NextFunction, Response } from "express";
import { UserRequest } from "../models/user-request-model";
import { ChatService } from "../services/chat-service";
import { ListMessageRequest, SendMessageRequest } from "../models/chat-message-model";
import { ResponseError } from "../error/response-error";

export class ChatController {
    static async sendMessage(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request = req.body as SendMessageRequest;
            const images = req.files as Express.Multer.File[]
            const response = await ChatService.sendMessage(req.user!, parseInt(req.params.receiverId), request, images)

            res.status(200).json({
                data: response,
            })
        } catch (error) {
            next(new ResponseError(400, "Bad Request!"));
        }
    }

    static async readMessages(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const requestData = req.body as ListMessageRequest;
            const response = await ChatService.readMessages(req.user!, parseInt(req.params.receiverId), requestData);
            
            res.status(200).json({
                data: response,
            });
        } catch (error) {
            next(new ResponseError(400, "Bad Request!"));
        }
    }

    static async getChatList(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const response = await ChatService.getChatList(req.user!);
        } catch (error) {
            next(new ResponseError(400, "Bad Request!"));
        }
    }
}