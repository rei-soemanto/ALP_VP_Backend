import express from "express";
import { InterestController } from "../../controllers/interest-controller";
import { UserController } from "../../controllers/user-controller";
import { profileImageMiddleware } from "../../middlewares/file-middleware";

export const userRoutes = express.Router();

userRoutes.post("/interests", InterestController.addInterests);
userRoutes.get("/current", UserController.get);

userRoutes.use(profileImageMiddleware.single("avatar"));
userRoutes.patch("/current", UserController.update);
userRoutes.delete("/current", UserController.delete);