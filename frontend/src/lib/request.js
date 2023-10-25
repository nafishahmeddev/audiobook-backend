import axios from "axios";
import store from "../store";
import { AuthActions } from "../store/slices/auth";
import * as AuthServices from "../services/auth.service";
class Request {
    http;
    _http;
    constructor(base = "/") {
        const _uri = import.meta.env.VITE_API_ENDPOINT;
        const _uri_with_base = `${import.meta.env.VITE_API_ENDPOINT}${base}`;

        this._http = this.createHttp(_uri);
        this.http = this.createHttp(_uri_with_base);
    }

    createHttp(_uri) {
        const _axios = axios.create({ baseURL: _uri });
        _axios.interceptors.request.use(
            function (config) {
                // Do something before request is sent
                const headers = {};
                if (localStorage.getItem("accessToken")) {
                    headers.Authorization = `${localStorage.getItem("accessToken")}`;
                }
                config.headers = headers;
                return config;
            },
            function (error) {
                // Do something with request error
                return Promise.reject(error);
            }
        );

        _axios.interceptors.response.use(
            (response) => {
                if (response.config.parse) {
                    //perform the manipulation here and change the response object
                    if (response.status !== 200) return Promise.reject(new Error(response.data.message));
                }
                if (response.data) return Promise.resolve(response.data);
                return response;
            },
            async (error) => {
                error.message = error?.response?.data?.message ?? error.message
                if (error.response.status === 410) {
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("role");
                    store.dispatch(AuthActions.reset());
                    return Promise.reject(new Error(error.message));
                } else if (error.response.status == 401) {
                    console.log("Access token expired. regenerating token");
                    const res = await AuthServices.token().catch((err) => {
                        console.log(err);
                        return false;
                    });
                    
                    if (res){
                        const http = this.createHttp(error.config._uri_with_base);
                        return http(error.config);
                    }
                }
                return Promise.reject(new Error(error.message));
            }
        );
        return _axios;
    }
}

export default Request;