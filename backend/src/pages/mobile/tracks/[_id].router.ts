import { Router } from "express";
import { Track } from "../../../db/default";
import ResponseHelper from "../../../helpers/ResponseHelper";

const router = Router({ mergeParams: true });

router.post("/", async (req: any, res: any) => {
    const _id = req.params._id;
    const track = await Track.findOne({ _id: _id })
        .populate("track")
        .populate("authors")
        .populate("genres")
        .populate("lists");

    return res.status(200).json(ResponseHelper.success({
        code: 200,
        message: "Successful",
        payload: {
            track
        }
    }));
})

export default router;