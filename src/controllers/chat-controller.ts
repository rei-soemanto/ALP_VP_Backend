import { NextFunction, Response } from "express";
import { UserRequest } from "../models/user-request-model";
import { ChatService } from "../services/chat-service";
import { ListMessageRequest, SendMessageRequest } from "../models/chat-message-model";

export class ChatController {
    static async sendMessage(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request = req.body as SendMessageRequest;
            const images = req.files as Express.Multer.File[]

            const response = await ChatService.sendMessage(req.user!, request, images)

            res.status(200).json({
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }

    static async listMessages(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request = req.body as ListMessageRequest;
            const response = await ChatService.listMessages(req.user!, request);
            res.status(200).json({
                data: response,
            });
        } catch (error) {
            next(error)
        }
    }
}