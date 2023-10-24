import path from "path";
import fs from "fs";
import { Application, Router, IRouter, RequestHandler } from "express";
import { printTable } from "console-table-printer";
const router = Router({
    mergeParams: true
});
const basePath = path.join(__dirname, "pages");
const baseEndpoint = "/api/v1";
const registered: { Path: string, Auth?: boolean }[] = [];

function generateUri(deps: string[] = [], filename = "") {
    const chunks = [baseEndpoint];
    deps.forEach(file => {
        if (file.startsWith("[") && file.endsWith("]")) {
            file = file.replace("[", ":").replace("]", "");
        }
        chunks.push(file);
    });
    if (filename && !filename.startsWith("index.")) {
        filename = filename.replace(".router.js", "").replace(".router.ts", "");
        if (filename.startsWith("[") && filename.endsWith("]")) {
            filename = filename.replace("[", ":").replace("]", "");
        }
        chunks.push(filename);
    }

    return chunks.join("/");
}
async function map(deps: string[] = []) {
    const folder = path.join(basePath, ...deps);
    const unsortedFiles = fs.readdirSync(folder);
    const organized: any = {
        folders: [],
        static: [],
        dynamic: []
    };

    for (const file of unsortedFiles) {
        const filepath = path.join(folder, file);
        const stats = fs.statSync(filepath);
        if (stats.isDirectory()) {
            organized.folders.push(file);
        } else if (file.startsWith("[")) {
            organized.dynamic.push(file);
        } else {
            organized.static.push(file);
        }
    }

    const files = [...organized.folders, ...organized.static, ...organized.dynamic];
    for (const file of files) {
        const filepath = path.join(folder, file);
        const stats = fs.statSync(filepath);

        //if directory then move
        if (stats.isDirectory()) {
            await map([...deps, file]);
            continue;
        } else if (!(file.endsWith(".router.ts") || file.endsWith(".router.js"))) {
            continue;
        }
        const module = (await import(filepath));
        const route: IRouter = module?.default;
        const uri: string = generateUri(deps, file);
        registered.push({
            Path: uri,
            Auth: false
        })

        const middlewares: RequestHandler[] = [];
        router.use(uri, ...middlewares, route);
    }
}

export default map().then(res => {

    const max = registered.reduce((max, current) => max < current.Path.length ? current.Path.length : max, 0);

    console.table(registered.map(r => {
        const needMore = Array.from(Array(max - r.Path.length).keys()).map(e => "").join(" ");
        r.Path = r.Path + needMore;
        return r;
    }));
    return router
});