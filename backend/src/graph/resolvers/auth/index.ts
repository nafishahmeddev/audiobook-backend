import { Admin } from "db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
export default {
    Query: {

    },
    Mutation: {
        async login(_: any, { email, password }: any, context: any) {
            console.log('yes here in the auth');
            email = email.toLowerCase();
            const user = await Admin.findOne({
                email: email
            });

            //check if user exists or not
            if (!user) return null;


            //check for password
            console.log("checking password");
            const isUserPasswordTrue = await bcrypt.compare(password, user.password);
            if (!isUserPasswordTrue) return null;

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
            return {
                accessToken: accessToken,
                refreshToken: refreshToken,
                user: user
            };

        },
    },
};
