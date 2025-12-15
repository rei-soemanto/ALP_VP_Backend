import express from "express";
import { chatAuthorizationMiddleware } from "../../middlewares/chat-authorization-middleware";

export const chatRoutes = express.Router();

// For /chats/:chatId routes
chatRoutes.use(chatAuthorizationMiddleware as unknown as express.RequestHandler);
// privateRouter.post("/chat/:chatId/messages", fileUploadMiddleware.array("images"), ChatController.sendMessage);
