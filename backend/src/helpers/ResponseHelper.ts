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

    static appendBaseurl(data: any) {
        return JSON.parse(JSON.stringify(data)
            .replace(/\/public\/images\//g, `${process.env.PUBLIC_URL?.replace(":", "\:")}/public/images/`)
            .replace(/\/public\/audios\//g, `${process.env.PUBLIC_URL?.replace(":", "\:")}/public/audios/`));
    }

}