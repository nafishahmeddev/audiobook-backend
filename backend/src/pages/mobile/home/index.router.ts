import { Router } from "express";
import { Album, Track } from "../../../db/default";
import ResponseHelper from "../../../helpers/ResponseHelper";

const router = Router({ mergeParams: true });
function baseUrl(_path: string): string {
    return process.env.PUBLIC_URL + _path;
}
router.get("/", async (req: any, res: any) => {
    const albums = await Album.aggregate([
        { $sample: { size: 10 } },
        { $limit: 10 },
        { $sort: { createdAt: -1 } },
        { $lookup: { from: "authors", localField: "authors", foreignField: "_id", as: "authors" } },
        { $lookup: { from: "genres", localField: "genres", foreignField: "_id", as: "genres" } },
        { $lookup: { from: "lists", localField: "lists", foreignField: "_id", as: "lists" } },
    ])
    const tracks = await Track.aggregate([
        { $sample: { size: 10 } },
        { $limit: 10 },
        { $sort: { createdAt: -1 } },
        { $lookup: { from: "albums", localField: "album", foreignField: "_id", as: "album" } },
        { $unwind: '$album' },
        { $lookup: { from: "authors", localField: "authors", foreignField: "_id", as: "authors" } },
        { $lookup: { from: "genres", localField: "genres", foreignField: "_id", as: "genres" } },
        { $lookup: { from: "lists", localField: "lists", foreignField: "_id", as: "lists" } },
    ])

    return res.status(200).json(ResponseHelper.success({
        code: 200,
        message: "Cool",
        payload: {
            trending: {
                albums: albums.map(album => ({ ...album, thumbnail: baseUrl(album.thumbnail) })),
                tracks: tracks.map(track => ({ ...track, thumbnail: baseUrl(track.thumbnail), audio: baseUrl(track.audio) })),
            }
        }
    }));
})

export default router;