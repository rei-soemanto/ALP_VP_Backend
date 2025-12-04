import express from "express"
import { authMiddleware } from "../middlewares/auth-middleware"
import { InterestController } from "../controllers/interest-controller"
import { PostController } from "../controllers/post-controller";
import { fileUploadMiddleware } from "../middlewares/file-middleware";
import { UserController } from "../controllers/user-controller";

export const privateRouter = express.Router();
privateRouter.use(authMiddleware);

privateRouter.use(authMiddleware)
privateRouter.post("/users/interests", authMiddleware, InterestController.addInterests)

privateRouter.get("/users/current", UserController.get);
privateRouter.get("/posts/mine", PostController.listMine);

privateRouter.post("/posts", fileUploadMiddleware.array("images", 5), PostController.create);
privateRouter.get("/posts", PostController.list);
privateRouter.put("/posts/:postId", PostController.update);
privateRouter.delete("/posts/:postId", PostController.delete);
privateRouter.post("/posts/:postId/like", PostController.toggleLike);