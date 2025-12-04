import { z, ZodType } from "zod"

export class PostValidation {
    static readonly CREATE: ZodType = z.object({
        caption: z.string().optional(),
        isPublic: z.string().optional().default("true")
    })

    static readonly UPDATE: ZodType = z.object({
        caption: z.string().optional(),
        isPublic: z.boolean().optional()
    })
}