import { Router } from "express";
import { Album, Author, Genre, List, Track } from "../../../db/default";
import ResponseHelper from "../../../helpers/ResponseHelper";
import { IAuthor } from "db/default/models/Author";

const router = Router({ mergeParams: true });

router.post("/", async (req: any, res: any) => {
    const page = Number(req.query.page || 1);
    const limit = Number(req.body.limit || 20);
    const skip = (page - 1) * limit;

    const query: any = {};
    if (req.body.album) query["album"] = req.body.album;
    if (req.body.keyword) {
        query.title = new RegExp(`(.*)${req.body.keyword}(.*)`, `i`);
    }
    const tracks = (await Track.find(query, { thumbnail: 0 }, { skip: skip, limit: limit, sort: { createdAt: -1 } })
        .populate([
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
        ]))

    const count = await Track.countDocuments(query);

    return res.status(200).json(ResponseHelper.success({
        code: 200,
        message: "Successful",
        payload: {
            tracks: tracks,
            pages: Math.ceil(count / limit),
            page,
            count,
            limit
        }
    }));
})

export default router;