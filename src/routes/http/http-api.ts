import express from "express"
import { publicRouter } from "./public";
import { privateRouter } from "./private";

export const httpAPIRouter = express.Router();

httpAPIRouter.use(publicRouter);
httpAPIRouter.use(privateRouter);

// httpAPIRouter.post("/register", UserController.register);
// httpAPIRouter.post("/login", UserController.login);
// httpAPIRouter.get("/interests", InterestController.list)

// httpAPIRouter.use(authMiddleware)

// httpAPIRouter.post("/users/interests", authMiddleware, InterestController.addInterests)

// httpAPIRouter.get("/users/current", UserController.get);
// httpAPIRouter.get("/posts/mine", PostController.listMine);

// httpAPIRouter.patch("/users/current", profileImageMiddleware.single("avatar"), UserController.update);

// httpAPIRouter.post("/posts", fileUploadMiddleware.array("images", 5), PostController.create);
// httpAPIRouter.get("/posts", PostController.list);
// httpAPIRouter.put("/posts/:postId", PostController.update);
// httpAPIRouter.delete("/posts/:postId", PostController.delete);
// httpAPIRouter.post("/posts/:postId/like", PostController.toggleLike);
// httpAPIRouter.post('/posts/:postId/comments', authMiddleware, CommentController.create);
// httpAPIRouter.get('/posts/:postId/comments', authMiddleware, CommentController.listByPost);