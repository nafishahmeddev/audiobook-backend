import Request from "@app/lib/request";
const request = new Request("/admin/settings/authors");


export const all = (data, page, limit) => {
    return request.http.post(`/?page=${page}&limit=${limit}`, data);
}

export const getAll = () => {
    return request.http.get(`/`);
}

export const create = (data) =>{
    return request.http.put(`/`, data);
}

export const update = (_id, data) =>{
    return request.http.put(`/${_id}`, data);
}

export const destroy = (_id) =>{
    return request.http.delete(`/${_id}`);
}

