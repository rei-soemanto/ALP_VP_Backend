import express from "express"
import { authMiddleware } from "../../middlewares/auth-middleware"
import { InterestController } from "../../controllers/interest-controller"
import { PostController } from "../../controllers/post-controller";
import { fileUploadMiddleware } from "../../middlewares/file-middleware";
import { UserController } from "../../controllers/user-controller";
import { CommentController } from "../../controllers/comment-controller";
import { profileImageMiddleware } from "../../middlewares/file-middleware";
import { userRoutes } from "./users";
import { postRoutes } from "./posts";

export const privateRouter = express.Router();

privateRouter.use(authMiddleware)

privateRouter.use('/users', userRoutes);
privateRouter.use('/posts', postRoutes);