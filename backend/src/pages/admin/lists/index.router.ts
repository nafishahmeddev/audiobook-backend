import { List } from "../../../db";
import { Router } from "express";
import PaginateHelper from "../../../helpers/PaginateHelper";
import ResponseHelper from "../../../helpers/ResponseHelper";
import multer from "multer";
import fs from "fs";
const upload = multer({ dest: '/tmp' })

const router = Router({ mergeParams: true });

router.post("/", async (req: any, res: any) => {
    const query = PaginateHelper.query(req);
    const options = PaginateHelper.options(req);

    const lists = await List.find(query, null, { ...options });
    const count = await List.countDocuments(query);

    return res.status(200).json(ResponseHelper.success({
        code: 200,
        payload: {
            lists: lists,
            count: count,
        }
    }));
})

router.put("/", upload.single("thumbnail"), async (req: any, res: any) => {
    const list = new List({ ...req.body });
    if (req.file) {
        const extension = req.file.originalname.split('.').pop();;
        const filepath = `${process.env.ASSETS_PATH}/public/images/${list.slug}-${Date.now()}.${extension}`;
        fs.renameSync(req.file.path, filepath)
        list.thumbnail = filepath.replace(process.env.ASSETS_PATH ?? "", "");
    }

    await list.save();

    return res.status(200).json(ResponseHelper.success({
        code: 200,
        payload: {
            list
        }
    }));
})

export default router;