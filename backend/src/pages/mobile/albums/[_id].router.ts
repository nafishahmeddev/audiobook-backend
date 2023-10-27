import { Router } from "express";
import { Album, Author, Genre, List, Track } from "../../../db/default";
import ResponseHelper from "../../../helpers/ResponseHelper";

const router = Router({ mergeParams: true });

router.get("/", async (req: any, res: any) => {
    const albumId = req.params.albumId;
    const album = (await Album.findOne({ _id: albumId })
        .populate([
            { path: "authors", model: Author },
            { path: "genres", model: Genre },
            { path: "lists", model: List },
        ]))?.generateUrls();


    return res.status(200).json(ResponseHelper.success({
        code: 200,
        message: "Successful",
        payload: {
            album
        }
    }));
})

export default router;