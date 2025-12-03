import express from "express"
import { authMiddleware } from "../middlewares/auth-middleware"
import { InterestController } from "../controllers/interest-controller"

export const privateRouter = express.Router()

privateRouter.use(authMiddleware)
privateRouter.post("/users/interests", authMiddleware, InterestController.addInterests)