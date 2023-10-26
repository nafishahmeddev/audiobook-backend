import { Router } from "express";
import { Album, Author, Genre, List, Track } from "../../../db/default";
import ResponseHelper from "../../../helpers/ResponseHelper";

const router = Router({ mergeParams: true });
function baseUrl(_path: string): string {
    return process.env.PUBLIC_URL + _path;
}
router.get("/", async (req: any, res: any) => {

    const genres = await Genre.aggregate([{ $sample: { size: 10 } }]);
    const lists = await List.aggregate([{ $sample: { size: 6 } }]);
    const authors = await Author.aggregate([{ $sample: { size: 10 } }]);

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
            lists: lists.map(list => ({ ...list.toJSON(), thumbnail: baseUrl(list.thumbnail) })),
            genres: genres.map(genre => ({ ...genre.toJSON(), thumbnail: baseUrl(genre.thumbnail) })),
            authors: authors.map(author => ({ ...author.toJSON(), image: baseUrl(author.image) })),
            albums: albums.map(album => ({ ...album, thumbnail: baseUrl(album.thumbnail) })),
            tracks: tracks.map(track => ({ ...track, thumbnail: baseUrl(track.thumbnail), audio: baseUrl(track.audio) })),
        }
    }));
})

export default router;