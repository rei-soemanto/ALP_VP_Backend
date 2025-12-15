import express from "express";

export const chatRoutes = express.Router();

chatRoutes.use(chatAuthorizationMiddleware);
// privateRouter.post("/chat/:chatId/messages", fileUploadMiddleware.array("images"), ChatController.sendMessage);
