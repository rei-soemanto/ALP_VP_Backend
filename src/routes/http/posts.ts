import express from "express";
import { PostController } from "../../controllers/post-controller";
import { fileUploadMiddleware } from "../../middlewares/file-middleware";
import { CommentController } from "../../controllers/comment-controller";
import { authMiddleware } from "../../middlewares/auth-middleware";

export const postRoutes = express.Router();

postRoutes.get("/", PostController.list);
postRoutes.post("/", fileUploadMiddleware.array("images", 5), PostController.create);

postRoutes.get("/mine", PostController.listMine);

postRoutes.put("/:postId", PostController.update);
postRoutes.delete("/:postId", PostController.delete);

postRoutes.post("/:postId/like", PostController.toggleLike);
postRoutes.post('/:postId/comments', CommentController.create);
postRoutes.get('/:postId/comments', CommentController.listByPost);