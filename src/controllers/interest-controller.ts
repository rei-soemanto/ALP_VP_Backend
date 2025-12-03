import { Request, Response, NextFunction } from "express"
import { InterestService } from "../services/interest-service"
import { AddUserInterestRequest } from "../models/interest-model"
import { UserRequest } from "../models/user-request-model"

export class InterestController {
    
    static async list(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await InterestService.list()
            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async addInterests(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request = req.body as AddUserInterestRequest[]
            await InterestService.addUserInterests(req.user!, request)

            res.status(200).json({
                data: "OK"
            })
        } catch (error) {
            next(error)
        }
    }
}