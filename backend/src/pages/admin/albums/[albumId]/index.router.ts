import { Album } from "db/default";
import { Router } from "express";
import multer from "multer";
import fs from "fs";
import PaginateHelper from "helpers/PaginateHelper";
import ResponseHelper from "helpers/ResponseHelper";
const upload = multer({ dest: '/tmp' })

const router = Router({mergeParams: true});

router.get("/", async (req: any, res: any)=>{
    const _id = req.params.albumId;
    const album = await Album.findOne({_id: _id});

    return res.status(200).json(ResponseHelper.success({
        code: 200,
        payload: {
            album
        }
    }));
})

router.put("/", upload.single("thumbnail"), async (req: any, res: any)=>{
    const _id = req.params.albumId;
    const album = await Album.findOne({_id: _id});

    if(!album) return res.status(404).json(ResponseHelper.error({
        code:404,
        message: 'The book you are looking for is not found.'
    }))

    if(req.file){
        const extension = req.file.originalname.split('.').pop();;
        const filepath = `${process.env.ASSETS_PATH}/public/images/${album.slug}-${Date.now()}.${extension}`;
        fs.renameSync(req.file.path, filepath)
        album.thumbnail = filepath.replace(process.env.ASSETS_PATH??"", "");
    }

    await album.save();

    return res.status(200).json(ResponseHelper.success({
        code: 200, 
        payload: {
            album
        }
    }));
})

export default router;