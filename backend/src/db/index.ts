import mongoose from "mongoose";

export { Admin } from "./models/Admin";
export { Album } from "./models/Album";
export { Track } from "./models/Track";
export { Author } from "./models/Author";
export { Genre } from "./models/Genre";
export { List } from "./models/List";

export const initDatabase = () => {
    return new Promise((resolve, reject) => {
        mongoose.set("debug", true);
        mongoose.connect(process.env.MONGODB_URI_DEFAULT as string);
        mongoose.connection.on("error", () => {
            console.log("database connection failed");
            reject(true);
        })

        mongoose.connection.on("open", () => {
            console.log("database connected");
            resolve(true);
        })
    })
}
