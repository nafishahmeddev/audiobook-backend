import { Router } from "express";
import { Album, Author, Genre, List, Track } from "../../../db/default";
import ResponseHelper from "../../../helpers/ResponseHelper";
import { FilterQuery } from "mongoose";
import { IAlbumModel } from "db/default/models/Album";

const router = Router({ mergeParams: true });

router.post("/", async (req: any, res: any) => {
    const page = Number(req.query.page || 1);
    const limit = 30;
    const skip = (page - 1) * limit;
    const query: FilterQuery<IAlbumModel> = {};
    if (req.body.keyword) {
        query.title = new RegExp(`(.*)${req.body.keyword}(.*)`, `i`);
    }
    const albums = await Album.find(query, null, { skip: skip, limit: limit, sort: { createdAt: -1 } })
        .populate([
            { path: "authors", model: Author },
            { path: "genres", model: Genre },
            { path: "lists", model: List },
        ])

    const count = await Album.countDocuments({});

    return res.status(200).json(ResponseHelper.success({
        code: 200,
        message: "Successful",
        payload: {
            albums,
            pages: Math.ceil(count / page),
            page,
            count,
        }
    }));
})

export default router;