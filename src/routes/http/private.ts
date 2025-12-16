import express from "express"
import { authMiddleware } from "../../middlewares/auth-middleware"
import { userRoutes } from "./users";
import { postRoutes } from "./posts";
import { chatRoutes } from "./chat";

export const privateRouter = express.Router();

privateRouter.use(authMiddleware)

privateRouter.use('/users', userRoutes);
privateRouter.use('/posts', postRoutes);
privateRouter.use('/chats', chatRoutes);