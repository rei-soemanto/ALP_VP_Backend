import { z, ZodType } from "zod"

export class ChatValidation {
    static readonly SEND_MESSAGE = z.object({
        content: z.string().optional().default('')
    });

    static readonly LIST_MESSAGES: ZodType<any> = z.object({
        chunkIndex: z.int().positive()
    });
}