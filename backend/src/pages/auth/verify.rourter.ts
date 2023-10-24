import { Router } from "express";
export const OPTIONS = { secure: true };
const router = Router({ mergeParams: true });

router.post("/", async (req: any, res: any) => {
    res.status(200).json({
        resultCode: 200,
        message: "Successful"
    })
});
export default router;