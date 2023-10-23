export default class ResponseHelper{
    static success(options : {
        payload?: any,
         code?: string | number,
         message?: string
    }){
        return {
            success: true,
            code: options.code? options.code.toString() : undefined,
            payload: options.payload,
            message: options.message
        }
    }

    static error(options: {
        payload?: any,
        code?: string | number,
        message?: string
    }){
        return {
            success: false,
            code: options.code? options.code.toString() : undefined,
            payload: options.payload,
            message: options.message
        }
    }

}