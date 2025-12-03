import { prismaClient } from "../utils/database-util"
import { Validation } from "../validations/validation"
import { InterestValidation } from "../validations/interest-validation"
import { 
    AddUserInterestRequest, 
    InterestResponse, 
    toInterestResponse 
} from "../models/interest-model"
import { UserJWTPayload } from "../models/user-model"
import { ResponseError } from "../error/response-error"

export class InterestService {

    static async list(): Promise<InterestResponse[]> {
        const interests = await prismaClient.interest.findMany()
        return interests.map(interest => toInterestResponse(interest))
    }

    static async addUserInterests(
        user: UserJWTPayload, 
        request: AddUserInterestRequest[]
    ): Promise<string> {
        
        const validatedRequest = Validation.validate(
            InterestValidation.ADD_USER_INTEREST, 
            request
        )

        const userExists = await prismaClient.user.findUnique({
            where: { id: user.id }
        })

        if (!userExists) {
            throw new ResponseError(404, "User not found")
        }

        await prismaClient.$transaction(
            validatedRequest.map((item) => 
                prismaClient.userInterest.create({
                    data: {
                        userId: user.id,
                        interestId: item.interestId,
                        isPrimary: item.isPrimary || false
                    }
                })
            )
        )

        return "Interests added successfully"
    }
}