import { Track } from "../../../db/default";
import { Router } from "express";
import PaginateHelper from "../../../helpers/PaginateHelper";
import ResponseHelper from "../../../helpers/ResponseHelper";
import multer from "multer";
import fs from "fs";
import Ffmpeg from "fluent-ffmpeg";
const upload = multer({ dest: '/tmp' })

const router = Router({ mergeParams: true });

router.post("/", async (req: any, res: any) => {
    const query = PaginateHelper.query(req);
    const options = PaginateHelper.options(req);

    const tracks = await Track.find(query, null, { ...options });
    const count = await Track.countDocuments(query);

    return res.status(200).json(ResponseHelper.success({
        code: 200,
        payload: {
            tracks: tracks,
            count: count,
        }
    }));
})

router.put("/", upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "audio", maxCount: 1, },
]), async (req: any, res: any) => {
    const track = new Track({ ...req.body });

    const thumbnail = req.files?.thumbnail?.[0];
    const audio = req.files?.audio?.[0];

    if (!thumbnail || !audio) return res.status(400).json(ResponseHelper.error({
        code: 400,
        message: "Please upload file"
    }))


    if (thumbnail) {
        const extension = thumbnail.originalname.split('.').pop();;
        const filepath = `${process.env.ASSETS_PATH}/public/images/${track.slug}-${Date.now()}.${extension}`;
        fs.renameSync(thumbnail.path, filepath)
        track.thumbnail = filepath.replace(process.env.ASSETS_PATH ?? "", "");
    }

    if (audio) {
        const extension = audio.originalname.split('.').pop();;
        const filepath = `${process.env.ASSETS_PATH}/public/audios/${track.slug}-${Date.now()}.m4a`;

        Ffmpeg(audio.path)
            .inputFormat('mp3')
            .audioChannels(2)
            .audioBitrate('64k')
            .audioCodec('aac')
            .output(filepath)
            .on('end', () => {
                console.log('Conversion finished');
            })
            .on('error', (err) => {
                console.error('Error:', err);
            })
            .run();
        track.audio = filepath.replace(process.env.ASSETS_PATH ?? "", "");
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