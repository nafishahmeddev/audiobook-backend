import { Author } from "db";
export default {
    Query: {
        async author(_: any, { _id }: any) {
            return await Author.findOne({ _id }, null, {});
        },
        async authors(_: any, __: any, context: any) {
            return await Author.find({}, null, {});
        },
    },
    Mutation: {
        async createAuthor(_: any, args: any, context: any) {
            const author = await Author.create(args)
            return author;
        },
        async updateAuthor(_: any, args: any, context: any) {
            const _id = args._id;
            delete args._id;
            return await Author.findOneAndUpdate({ _id: _id }, { $set: args }, { new: true })
        },
        async deleteAuthor(_: any, { _id }: any, context: any): Promise<boolean> {
            const resp = await Author.deleteOne({ _id });
            return resp.deletedCount > 0;
        },
    },
};
