import { Router } from "express";
import { Album, Author, Genre, List, Track } from "../../../db/default";
import ResponseHelper from "../../../helpers/ResponseHelper";

const router = Router({ mergeParams: true });

router.post("/", async (req: any, res: any) => {
    const _id = req.params._id;
    const track = await Track.findOne({ _id: _id })
        .populate([
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
        ])

    track?.generateUrls();

    return res.status(200).json(ResponseHelper.success({
        code: 200,
        message: "Successful",
        payload: {
            track
        }
    }));
})

export default router;