import express from 'express';
import { UserController } from '../controllers/user-controller';
import { InterestController } from '../controllers/interest-controller';

export const publicRouter = express.Router();

publicRouter.post("/register", UserController.register);
publicRouter.post("/login", UserController.login);
publicRouter.get("/interests", InterestController.list)