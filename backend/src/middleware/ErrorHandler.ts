import ResponseHelper from "../helpers/ResponseHelper";

export default function (err :any, req:any , res:any , next:any ) {
    console.log("Middleware Error Handling");
    const errStatus = err.statusCode || 500;
    const errMsg = err.message || 'Something went wrong';

    res.status(errStatus).json(ResponseHelper.error({
        code: errStatus,
        message: errMsg,
        payload: {
        stack: process.env.NODE_ENV === 'development' ? err.stack : {}
        }
    }))
};