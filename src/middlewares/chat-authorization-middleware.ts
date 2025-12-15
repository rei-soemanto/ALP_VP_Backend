import { NextFunction } from "express";
import { UserRequest } from "../models/user-request-model";
import { ChatService } from "../services/chat-service";
import { ResponseError } from "../error/response-error";

export const chatAuthorizationMiddleware = async (
    req: UserRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        if (await ChatService.isUserInChat(req.user!.id, parseInt(req.params.chatId))) {
            next();
        } else {
            next(new ResponseError(401, "Unauthorized user!"))
        }
    } catch (error) {
        next(error)
    }
}