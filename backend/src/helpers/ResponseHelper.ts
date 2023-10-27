export default class ResponseHelper {
    static success(options: {
        payload?: any,
        code?: string | number,
        message?: string
    }) {
        return {
            success: true,
            successCode: options.code ? options.code.toString() : undefined,
            result: options.payload,
            message: options.message
        }
    }

    static error(options: {
        payload?: any,
        code?: string | number,
        message?: string
    }) {
        return {
            success: false,
            errorCode: options.code ? options.code.toString() : undefined,
            result: options.payload,
            message: options.message
        }
    }
}