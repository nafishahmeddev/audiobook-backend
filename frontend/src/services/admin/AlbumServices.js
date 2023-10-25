import Request from "@app/lib/request";
const request = new Request("/admin/albums");
export default class AlbumServices {
    static all = (data, params = {}) => request.http.post("/", data, { params: params });
    static create = (data) => request.http.put("/", data);
    static update = (_id, data) => request.http.put(`/${_id}`, data);
    static destroy = (_id) => request.http.delete(`/${_id}`);
    static get = (_id) => request.http.get(`/${_id}`);
}