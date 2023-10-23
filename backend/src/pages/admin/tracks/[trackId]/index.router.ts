import { Track } from "db/default";
import { Router } from "express";
import multer from "multer";
import fs from "fs";
import PaginateHelper from "helpers/PaginateHelper";
import ResponseHelper from "helpers/ResponseHelper";
const upload = multer({ dest: '/tmp' })

const router = Router({mergeParams: true});

router.get("/", async (req: any, res: any)=>{
    const query = PaginateHelper.query(req);
    const options = PaginateHelper.options(req);

    const tracks = await Track.find(query,null, {...options});
    const count = await Track.countDocuments(query);

    return res.status(200).json(ResponseHelper.success({
        code: 200,
        payload: {
            tracks: tracks,
            count: count,
        }
    }));
})

router.put("/", upload.single("thumbnail"), async (req: any, res: any)=>{
    const _id = req.params.trackId;
    const track = await Track.findOne({_id: _id});

    if(!track) return res.status(404).json(ResponseHelper.error({
        code:404,
        message: 'The book you are looking for is not found.'
    }))

    if(req.file){
        const extension = req.file.originalname.split('.').pop();;
        const filepath = `${process.env.ASSETS_PATH}/public/images/${track.slug}-${Date.now()}.${extension}`;
        fs.renameSync(req.file.path, filepath)
        track.thumbnail = filepath.replace(process.env.ASSETS_PATH??"", "");
    }

    await track.save();

    return res.status(200).json(ResponseHelper.success({
        code: 200, 
        payload: {
            track
        }
    }));
})

export default router;