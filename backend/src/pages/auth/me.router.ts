import { Router } from "express";
import { Admin } from "../../db/default";
export const OPTIONS = { secure: true };
const router = Router({ mergeParams: true });

router.get("/", async (req: any, res: any) => {
    const user = await Admin.findOne({ _id: req.user._id });
    res.status(200).json({
        resultCode: 200,
        message: "Successful",
        data: user
    })
});
export default router;