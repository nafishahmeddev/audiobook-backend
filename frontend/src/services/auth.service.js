import store from "../store";
import { AuthActions } from "../store/slices/auth";
import Request from "../lib/request";
const request = new Request("/auth");

export const login = (username, password) => {
    return new Promise((resolve, reject) => {
        request.http.post("/login", { username, password }).then(res => {
            localStorage.setItem("accessToken", res.data.accessToken);
            localStorage.setItem("refreshToken", res.data.refreshToken);
            localStorage.setItem("role", res.data.role);
            store.dispatch(AuthActions.update({
                accessToken: res.data.accessToken,
                refreshToken: res.data.refreshToken,
                role: res.data.role,
            }));
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    });
}

export const verify = () => {
    if (localStorage.getItem("accessToken")) {
        return new Promise((resolve, reject) => {
            request.http.post("/verify").then(res => {
                store.dispatch(AuthActions.update({
                    accessToken: localStorage.getItem("accessToken"),
                    refreshToken: localStorage.getItem("refreshToken"),
                    role: localStorage.getItem("role")
                }));
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        })
    } else {
        return Promise.reject(new Error("Token is not there"));
    }
}

export const me = () => {
    return request.http.get("/me").then(res => {
        store.dispatch(AuthActions.update({
            profile: res.data,
        }));
        return res;
    });
}

export const token = () => {
    return new Promise((resolve, reject) => {
        request.http.post("/token", { refreshToken: localStorage.getItem("refreshToken") }).then(res => {
            localStorage.setItem("accessToken", res.data.accessToken);
            localStorage.setItem("refreshToken", res.data.refreshToken);
            localStorage.setItem("role", res.data.role);
            store.dispatch(AuthActions.update({
                accessToken: res.data.accessToken,
                refreshToken: res.data.refreshToken,
                role: res.data.role,
            }));
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    });
}

export const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    store.dispatch(AuthActions.reset());
}