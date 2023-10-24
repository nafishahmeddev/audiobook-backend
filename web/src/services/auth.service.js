import store from "@app/store";
import { AuthActions } from "@app/store/slices/auth";
import Request from "@app/lib/request";
const request = new Request("/auth");

export const login = (email, password) => {
  return new Promise((resolve, reject) => {
    request.http
      .post("/login", { email, password })
      .then((res) => {
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("name", res.data.name);
        store.dispatch(
          AuthActions.update({
            accessToken: res.data.accessToken,
            refreshToken: res.data.refreshToken,
            role: res.data.accessType,
            name: res.data.name,
          })
        );
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const verify = () => {
  if (localStorage.getItem("accessToken")) {
    return new Promise((resolve, reject) => {
      request.http
        .post("/verify")
        .then((res) => {
          store.dispatch(
            AuthActions.update({
              accessToken: localStorage.getItem("accessToken"),
              refreshToken: localStorage.getItem("refreshToken"),
              role: localStorage.getItem("role"),
              name: localStorage.getItem("name"),
            })
          );
          resolve(res);
        })
        .catch((err) => {
          resolve(err);
          // reject(err);
        });
    });
  } else {
    return Promise.reject(new Error("Token is not there"));
  }
};

export const me = () => {
  return { data: { name: "me", role: "admin" } };
  return request.http.get("/me").then((res) => {
    store.dispatch(
      AuthActions.update({
        profile: res.data,
      })
    );
    return res;
  });
};

export const token = () => {
  return new Promise((resolve, reject) => {
    request.http
      .post("/token", { refreshToken: localStorage.getItem("refreshToken") })
      .then((res) => {
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        localStorage.setItem("role", res.data.role);
        store.dispatch(
          AuthActions.update({
            accessToken: res.data.accessToken,
            refreshToken: res.data.refreshToken,
            role: res.data.accessType,
          })
        );
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("role");
  store.dispatch(AuthActions.reset());
};
