import { Router } from "express";
import { Admin } from "../../db/default";
import jwt from "jsonwebtoken";

const router = Router({ mergeParams: true });
router.post("/", async (req: any, res) => {
    try {
        const rToken = req.body.refreshToken;
        const payload: any = await jwt.verify(rToken, process.env.ACCESS_ENCRYPTION_KEY || "DEAUlT");
        const user: any = await Admin.findOne({
            _id: payload._id
        });

        const accessToken = await jwt.sign(
            {
                _id: user._id,
                email: user.email,
                type: "ACCESS_TOKEN"
            },
            process.env.ACCESS_ENCRYPTION_KEY || "DEAUlT",
            {
                expiresIn: "5h",
            }
        );

        const refreshToken = await jwt.sign(
            {
                _id: user._id,
                email: user.email,
                type: "REFRESH_TOKEN"
            },
            process.env.ACCESS_ENCRYPTION_KEY || "DEAUlT",
            {
                expiresIn: "1d",
            }
        );
        res.json({
            resultCode: 200,
            message: "Successfully logged in",
            data: {
                accessToken: accessToken,
                refreshToken: refreshToken,
            },
        });
    } catch (err) {
        return res.status(410).json({
            resultCode: 410,
            message: "WRONG_CREDENTIALS",
        });
    }
});
export default router;
