import { Router } from "express";
import { Album, Author, Genre, List, Track } from "../../../db/default";
import ResponseHelper from "../../../helpers/ResponseHelper";

const router = Router({ mergeParams: true });
function baseUrl(_path: string): string {
    return process.env.PUBLIC_URL + _path;
}
router.post("/", async (req: any, res: any) => {

    const keyword = req.body.keyword || "";
    const regexp = RegExp(`(.*)${keyword}(.*)`, `i`);

    const genres = await Genre.find({ name: regexp }, null, { limit: 10 });
    const lists = await List.find({ name: regexp }, null, { limit: 10 });
    const authors = await Author.find({
        "$expr": {
            "$regexMatch": {
                "input": { "$concat": ["$firstName", " ", "$lastName"] },
                "regex": `(.*)${keyword}(.*)`,  //Your text search here
                "options": "i"
            }
        }
    }, null, { limit: 10 });

    const albums = await Album.find({ title: regexp }, null).limit(10).populate([
        { path: "authors", model: Author },
        { path: "genres", model: Genre },
        { path: "lists", model: List }
    ])

    const tracks = await Track.find({ title: regexp }, null).limit(10).populate([
        { path: "authors", model: Author },
        { path: "genres", model: Genre },
        { path: "lists", model: List },
        {
            path: "album", model: Album, populate: [
                { path: "authors", model: Author },
                { path: "genres", model: Genre },
                { path: "lists", model: List }
            ]
        }
    ]);

    return res.status(200).json(ResponseHelper.appendBaseurl(ResponseHelper.success({
        code: 200,
        message: "Successful",
        payload: {
            lists: lists,
            genres: genres,
            authors: authors,
            albums: albums,
            tracks: tracks,
        }
    })));
})

export default router;