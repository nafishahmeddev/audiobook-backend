export default class PaginateHelper {
    static query(req : any) {
        const query: { [key: string]: string | number | object | Array<string | number | object> } = req.body.filter ?? {};
        Object.entries(query).forEach(([key, val]: Array<any>) => {
            if (val === "" || val.length === 0) delete query[key]
            if (Array.isArray(val)) {
                query[key] = val
            }
        });
        return query;
    }

    static options(req: any) {
        const params: { [key: string]: any } = {
            page: Number(req.query.page ?? 1),
            limit: Number(req.query.limit ?? 20)
        }
        params.skip = (params.page - 1) * params.limit;
        if (req.body.sort && req.body.sort.length > 0) {
            params.sort = {};
            req.body.sort.forEach(({ field, sort } : {field: string, sort: string}) => {
                params.sort[field] = sort == "asc" ? 1 : -1;
            });
        }
        return params;
    }
}
