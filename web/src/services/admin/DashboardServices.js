import Request from "@app/lib/request";
const request = new Request("/admin/dashboard");
export default class DashboardServices {
    static stats = (from, to) => request.http.post("/stats", { from, to });
    static all = () => request.http.get("/")
    static get = (_id) => request.http.get(`/${_id}`)
}