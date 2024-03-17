import { Genre, List } from "db";
export default {
    Query: {
        async genre(_: any, { _id }: any) {
            return await Genre.findOne({ _id }, null, {});
        },
        async genres(_: any, __: any, context: any) {
            return await Genre.find({}, null, {});
        },
    },
    Mutation: {
        async createGenre(_: any, args: any, context: any) {
            const genre = await Genre.create(args)
            return genre;
        },
        async updateGenre(_: any, args: any, context: any) {
            const _id = args._id;
            delete args._id;
            return await Genre.findOneAndUpdate({ _id: _id }, { $set: args }, { new: true })
        },
        async deleteGenre(_: any, { _id }: any, context: any): Promise<boolean> {
            const resp = await Genre.deleteOne({ _id });
            return resp.deletedCount > 0;
        },
    },
};
