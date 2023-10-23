import mongoose from "mongoose";
const connections : {[key:string]: mongoose.Connection} = {};
const urls : any = {
    "default": process.env.MONGODB_URI_DEFAULT,
}

export async function initConnection(keys : string[] = []) {
    if(process.env.NODE_ENV == "development") mongoose. set('debug', true);
    if (!keys || keys.length == 0) keys = Object.keys(urls);
    for (const key in urls) {
        if (!keys.includes(key)) continue;
        connections[key] = await mongoose.createConnection(urls[key]);
        connections[key].on('error', console.error.bind(console, 'connection error:'));
        connections[key].once('open', () => {
            console.log(`Database \`${key}\` Connected!`);
        });
    }
    return true;
}
export function getConnection(key = "default") {
    if (!connections[key]) {
        throw new Error("Connection not found!");
    }
    return connections[key];
}

export default {
    initConnection,
    getConnection
}