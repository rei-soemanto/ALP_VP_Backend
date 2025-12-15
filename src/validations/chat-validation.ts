import { z, ZodType } from "zod"

export class ChatValidation {
    static readonly SEND_MESSAGE = z.object({
        chatId: z.int().positive(),
        content: z.string().optional().default('')
    });

    static readonly LIST_MESSAGES: ZodType<any> = z.object({
        chatId: z.int().positive(),
        chunkIndex: z.int().positive()
    });
}