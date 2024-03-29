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

    const albums = await Album.find({ title: regexp }, { thumbnail: 0 }).limit(10).populate([
        { path: "authors", model: Author, select: "-image" },
        { path: "genres", model: Genre, select: "-thumbnail" },
        { path: "lists", model: List, select: "-thumbnail" },
    ])

    const tracks = await Track.find({ title: regexp }, { thumbnail: 0 }).limit(10).populate([
        { path: "authors", model: Author, select: "-image" },
        { path: "genres", model: Genre, select: "-thumbnail" },
        { path: "lists", model: List, select: "-thumbnail" },
        {
            path: "album", model: Album, select: "-thumbnail",
            populate: [
                { path: "authors", model: Author, select: "-image" },
                { path: "genres", model: Genre, select: "-thumbnail" },
                { path: "lists", model: List, select: "-thumbnail" },
            ]
        }
    ]);

    return res.status(200).json(ResponseHelper.success({
        code: 200,
        message: "Successful",
        payload: {
            lists: lists,
            genres: genres,
            authors: authors,
            albums: albums,
            tracks: tracks,
        }
    }));
})

export default router;