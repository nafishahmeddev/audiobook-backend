import Request from "@app/lib/request";
const request = new Request("/admin/albums");

export const all = (data, page, limit) => {
  return request.http.post(`/?page=${page}&limit=${limit}`, data);
};

export const one = (_id) => {
  return request.http.get(`/${_id}`);
};

export const create = (data) => {
  return request.http.put(`/`, data);
};

export const update = (_id, data) => {
  return request.http.put(`/${_id}`, data);
};

export const destroy = (_id) => {
  return request.http.delete(`/${_id}`);
};
