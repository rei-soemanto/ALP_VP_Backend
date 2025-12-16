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
        // const chatExists = await ChatService.chatExists(
        //     parseInt(req.params.chatId)
        // );

        // if (chatExists) {
        //     const isUserInChat = await ChatService.isUserInChat(
        //         req.user!.id,
        //         parseInt(req.params.chatId)
        //     );

        //     if (!isUserInChat) {
        //         next(new ResponseError(401, "Unauthorized user!"))
        //     }
        // }

        next();
    } catch (error) {
        next(error)
    }
}