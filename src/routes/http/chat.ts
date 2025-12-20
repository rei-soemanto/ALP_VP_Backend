import express from "express";
import { chatAuthorizationMiddleware } from "../../middlewares/chat-authorization-middleware";
import { fileUploadMiddleware } from "../../middlewares/file-middleware";
import { ChatController } from "../../controllers/chat-controller";

export const chatRoutes = express.Router();

// For /chats/:chatId routes
// chatRoutes.use(chatAuthorizationMiddleware as unknown as express.RequestHandler);

chatRoutes.get('/list', ChatController.getChatList);

chatRoutes.get('/:counterPartId/messages', ChatController.readMessages);
chatRoutes.post("/:counterPartId/messages", fileUploadMiddleware.array("images"), ChatController.sendMessage);

chatRoutes.get('/:counterPartId/images', ChatController.getImages);