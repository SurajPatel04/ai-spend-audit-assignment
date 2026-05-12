import type {
    Request,
    Response,
    NextFunction,
} from 'express'

import { ApiError } from '../utils/apiError.js'

interface ErrorResponse {
    success: boolean
    message: string
    errors?: Record<string, string>[]
    stack?: string
}

export const errorMiddleware = (
    err: Error | ApiError,
    _req: Request,
    res: Response,
    _next: NextFunction
): Response<ErrorResponse> => {
    const statusCode =
        err instanceof ApiError
            ? err.statusCode
            : 500

    const response: ErrorResponse = {
        success: false,

        message:
            err.message || 'Internal Server Error',
    }

    if (err instanceof ApiError) {
        response.errors = err.errors
    }

    if (process.env["NODE_ENV"] === 'development' && err.stack !== undefined) {
        response.stack = err.stack
    }

    return res.status(statusCode).json(response)
}