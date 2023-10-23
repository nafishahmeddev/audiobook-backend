import { Album } from "../../../db/default";
import { Router } from "express";
import PaginateHelper from "../../../helpers/PaginateHelper";
import ResponseHelper from "../../../helpers/ResponseHelper";
import multer from "multer";
import fs from "fs";
const upload = multer({ dest: '/tmp' })

const router = Router({mergeParams: true});

router.post("/", async (req: any, res: any)=>{
    const query = PaginateHelper.query(req);
    const options = PaginateHelper.options(req);

    const albums = await Album.find(query,null, {...options});
    const count = await Album.countDocuments(query);

    return res.status(200).json(ResponseHelper.success({
        code: 200,
        payload: {
            albums: albums,
            count: count,
        }
    }));
})

router.put("/", upload.single("thumbnail"), async (req: any, res: any)=>{
    const album = new Album({...req.body});
    await album.generateSlug();

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