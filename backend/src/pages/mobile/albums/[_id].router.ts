import { Router } from "express";
import { Album, Author, Genre, List, Track } from "../../../db";
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

router.get("/tracks", async (req: any, res: any) => {
    const albumId = req.params.albumId;
    const tracks = await Track.find({ album: albumId }, { thumbnail: 0 })
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
        ]);


    return res.status(200).json(ResponseHelper.success({
        code: 200,
        message: "Successful",
        payload: {
            tracks
        }
    }));
})

export default router;