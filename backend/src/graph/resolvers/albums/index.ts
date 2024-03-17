import { Album, Author, Genre, List } from "db";
export default {
    Query: {
        async album(_: any, { _id }: any) {
            return await Album.findOne({ _id }, null, {
                populate: [
                    { path: "authors", model: Author, select: "-image" },
                    { path: "genres", model: Genre, select: "-thumbnail" },
                    { path: "lists", model: List, select: "-thumbnail" },
                ]
            });
        },
        async albums(_: any, __: any, context: any) {
            return await Album.find({}, null, {
                populate: [
                    { path: "authors", model: Author, select: "-image" },
                    { path: "genres", model: Genre, select: "-thumbnail" },
                    { path: "lists", model: List, select: "-thumbnail" },
                ]
            });
        },
    },
    Mutation: {
        async createAlbum(_: any, args: any, context: any) {
            const album = await Album.create(args)
            return album;
        },
        async updateAlbum(_: any, args: any, context: any) {
            const _id = args._id;
            delete args._id;
            return await Album.findOneAndUpdate({ _id: _id }, { $set: args }, { new: true })
        },
        async deleteAlbum(_: any, { _id }: any, context: any): Promise<boolean> {
            const resp = await Album.deleteOne({ _id });
            return resp.deletedCount > 0;
        },
    },
};
