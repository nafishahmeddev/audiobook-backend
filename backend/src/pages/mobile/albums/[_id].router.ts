import { Router } from "express";
import { Album, Track } from "../../../db/default";
import ResponseHelper from "../../../helpers/ResponseHelper";

const router = Router({ mergeParams: true });

router.post("/", async (req: any, res: any) => {
    const albumId = req.params.albumId;
    const album = await Album.findOne({ _id: albumId })
        .populate("album")
        .populate("authors")
        .populate("genres")
        .populate("lists");

    return res.status(200).json(ResponseHelper.success({
        code: 200,
        message: "Successful",
        payload: {
            album
        }
    }));
})

export default router;