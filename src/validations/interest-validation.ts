import { z, ZodType } from "zod"

export class InterestValidation {
    
    static readonly CREATE: ZodType = z.object({
        name: z.string().min(1)
    })

    static readonly ADD_USER_INTEREST: ZodType = z.array(
        z.object({
            interestId: z.number().int().positive(),
            isPrimary: z.boolean().optional().default(false)
        })
    ).min(1, { message: "At least one interest must be selected" })
}