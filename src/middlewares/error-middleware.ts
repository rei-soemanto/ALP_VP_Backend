import { Prisma } from '../../generated/prisma';
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ResponseError } from '../error/response-error';

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    let responseError: ResponseError;

    if (err instanceof ResponseError) {
        responseError = err;
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) { // Generic Prisma Errors
        switch (err.code) {
        case 'P2025':
            responseError = new ResponseError(404, (err.meta as any).cause);
            break;

        case 'P2002':
            responseError = new ResponseError(409, `Duplicate record ${(err as any).meta.target.map(e => '\"' + e + '\"').join(', ')} exists.`);
            break;

        default:
            responseError = new ResponseError(500, 'Internal Server Error.');
            break;
        }
    } else if (err instanceof ZodError) { // Type errors
        const issue = err.issues[0];
        const field = issue.path?.join('.') || 'Field';

        let message;

        switch (issue.code) {
        case 'invalid_type':
            message = `\"${field}\" must be of type ${issue.expected}.`;
            break;

        case 'invalid_format':
            message = `\"${field}\" is not in the correct format.`;
            break;

        default:
            message = issue.message;
            break;
        }

        responseError = new ResponseError(400, message);
    } else if (err.type === 'entity.parse.failed') { // Malformed JSON
        responseError = new ResponseError(400, 'Invalid JSON payload.');
    } else { // Unknown errors
        console.error(err);
        responseError = new ResponseError(500, 'Internal Server Error.');
    }

    res.status(responseError.status).json({
        status: 'error',
        message: responseError.message,
    });
};