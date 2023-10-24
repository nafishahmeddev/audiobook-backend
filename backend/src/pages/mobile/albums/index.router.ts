import { Router } from "express";
import { Album, Track } from "../../../db/default";
import ResponseHelper from "../../../helpers/ResponseHelper";

const router = Router({ mergeParams: true });

router.post("/", async (req: any, res: any) => {
    const page = Number(req.query.page || 1);
    const limit = 30;
    const skip = (page - 1) * limit;
    const albums = await Album.find({}, null, { skip: skip, limit: limit, sort: { createdAt: -1 } })
        .populate("album")
        .populate("authors")
        .populate("genres")
        .populate("lists");

    const count = await Album.countDocuments({});

    return res.status(200).json(ResponseHelper.success({
        code: 200,
        message: "Successful",
        payload: {
            albums,
            pages: Math.ceil(count / page)
        }
    }));
})

export default router;