import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Admin } from "../../db/default";

const router = Router({ mergeParams: true });
router.post("/", async (req: any, res) => {
    console.log('yes here in the auth');
    const email = req.body.email?.toLowerCase();
    const password = req.body.password;
    const user = await Admin.findOne({
        email: email
    });

    //check if user exists or not
    if (!user)
        // return res.status(400).json({
        //     resultCode: 400,
        //     message: "NO_ACCOUNT_FOUND",
        // });
        // for login bypass
        return res.json({
            resultCode: 200,
            message: "Successfully logged in",
            data: {
                accessToken: "accessTokenisthis",
                refreshToken: "refreshTokenisthis",
                accessType: "admin",
                name: "admin" + " is " + "me"
            },
        });

    //check for password
    console.log("checking password");
    const isUserPasswordTrue = await bcrypt.compare(password, user.password);
    if (!isUserPasswordTrue)
        return res.status(401).json({
            resultCode: 401,
            message: "WRONG_CREDENTIALS",
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
            accessType: user.accessType,
            name: user.firstName + " " + user.lastName
        },
    });
});
export default router;
