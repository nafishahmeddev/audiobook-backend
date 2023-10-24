import { Router } from "express";
import { Album, Track } from "../../../db/default";
import ResponseHelper from "../../../helpers/ResponseHelper";

const router = Router({ mergeParams: true });

router.get("/", async (req: any, res: any) => {
    const albums = await Album.find({}, null, { limit: 10, sort: { createdAt: -1 } })
    const tracks = await Track.find({}, null, { limit: 10, sort: { createdAt: -1 } })
        .populate("album")
        .populate("authors")
        .populate("genres")
        .populate("lists")

    return res.status(200).json(ResponseHelper.success({
        code: 200,
        message: "Cool",
        payload: {
            trending: {
                albums: albums.map(album => album.generateUrls()),
                tracks: tracks.map(track => track.generateUrls()),
            }
        }
    }));
})

export default router;