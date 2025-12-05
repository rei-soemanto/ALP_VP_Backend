import { z, ZodType } from "zod";

export class CommentValidation {
    static readonly CREATE: ZodType = z.object({
        content: z.string().min(1, "Comment content cannot be empty"),
        replyingToId: z.number().optional()
    });
}