import { Author } from "../../../../db";
import { Router } from "express";
import multer from "multer";
import fs from "fs";
import PaginateHelper from "../../../../helpers/PaginateHelper";
import ResponseHelper from "../../../../helpers/ResponseHelper";
const upload = multer({ dest: '/tmp' })

const router = Router({ mergeParams: true });

router.get("/", async (req: any, res: any) => {
    const query = PaginateHelper.query(req);
    const options = PaginateHelper.options(req);

    const authors = await Author.find(query, null, { ...options });
    const count = await Author.countDocuments(query);

    return res.status(200).json(ResponseHelper.success({
        code: 200,
        payload: {
            authors: authors,
            count: count,
        }
    }));
})

router.put("/", upload.single("image"), async (req: any, res: any) => {
    const _id = req.params.authorId;
    const author = await Author.findOne({ _id: _id });

    if (!author) return res.status(404).json(ResponseHelper.error({
        code: 404,
        message: 'The book you are looking for is not found.'
    }))

    if (req.file) {
        const extension = req.file.originalname.split('.').pop();;
        const filepath = `${process.env.ASSETS_PATH}/public/images/${author.slug}-${Date.now()}.${extension}`;
        fs.renameSync(req.file.path, filepath)
        author.image = filepath.replace(process.env.ASSETS_PATH ?? "", "");
    }

    await author.save();

    return res.status(200).json(ResponseHelper.success({
        code: 200,
        payload: {
            author
        }
    }));
})

export default router;