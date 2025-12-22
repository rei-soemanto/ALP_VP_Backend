import { NextFunction, Response } from "express";
import { UserRequest } from "../models/user-request-model";
import { ChatService } from "../services/chat-service";
import { SendMessageRequest } from "../models/chat-message-model";
import { ResponseError } from "../error/response-error";

export class ChatController {
    static async sendMessage(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request = req.body as SendMessageRequest;
            const images = req.files as Express.Multer.File[]
            const response = await ChatService.sendMessage(req.user!, parseInt(req.params.counterPartId), request, images)

            res.status(200).json({
                data: response,
            })
        } catch (error) {
            next(error);
        }
    }

    static async readMessages(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const messages = await ChatService.readMessages(req.user!, Number(req.params.counterPartId));

            res.status(200).json({
                data: messages,
            });
        } catch (error) {
            next(error);
        }
    }

    static async readMessage(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const messageId = Number(req.params.messageId);
            const response = await ChatService.readMessage(req.user!, Number(req.params.counterPartId), messageId);

            res.status(200).json({
                data: response,
            });
        } catch (error) {
            next(error);
        }
    }

    static async getImages(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const images = await ChatService.getImages(req.user!, Number(req.params.counterPartId), Number(req.query.messageId));

            res.status(200).json({
                data: images,
            });
        } catch (error) {
            next(error);
        }
    }

    static async getChatList(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const chatList = await ChatService.getChatList(req.user!);

            res.status(200).json({
                data: chatList,
            });
        } catch (error) {
            next(error);
        }
    }
}