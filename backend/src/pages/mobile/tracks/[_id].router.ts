import { Router } from "express";
import { Album, Author, Genre, List, Track } from "../../../db/default";
import ResponseHelper from "../../../helpers/ResponseHelper";

const router = Router({ mergeParams: true });

router.get("/", async (req: any, res: any) => {
    const _id = req.params._id;
    const track = await Track.findOne({ _id: _id }, { thumbnail: 0 })
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
        ])

    return res.status(200).json(ResponseHelper.success({
        code: 200,
        message: "Successful",
        payload: {
            track
        }
    }));
})

export default router;