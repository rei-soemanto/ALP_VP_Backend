import express from "express";
import { chatAuthorizationMiddleware } from "../../middlewares/chat-authorization-middleware";
import { chatImageMiddleware, fileUploadMiddleware } from "../../middlewares/file-middleware";
import { ChatController } from "../../controllers/chat-controller";

export const chatRoutes = express.Router();

// For /chats/:chatId routes
// chatRoutes.use(chatAuthorizationMiddleware as unknown as express.RequestHandler);

chatRoutes.get('/list', ChatController.getChatList);

chatRoutes.get('/:counterPartId/messages', ChatController.readMessages);
chatRoutes.get('/:counterPartId/images', ChatController.getImages);

// chatRoutes.use(chatImageMiddleware.array("images"))
chatRoutes.post("/:counterPartId/messages", chatImageMiddleware.array("images"), ChatController.sendMessage);
chatRoutes.put("/:counterPartId/messages/:messageId", ChatController.readMessage);
