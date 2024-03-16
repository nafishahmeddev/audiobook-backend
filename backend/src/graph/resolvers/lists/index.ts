import { List } from "db";
export default {
    List: {
        id: (parent: any) => parent.id ?? parent._id,
    },
    Query: {
        async list(_: any, { _id }: any) {
            return await List.findOne({ _id }, null, {});
        },
        async lists(_: any, __: any, context: any) {
            return await List.find({}, null, {});
        },
    },
    Mutation: {
        async createList(_: any, args: any, context: any) {
            const list = await List.create(args)
            return list;
        },
        async updateList(_: any, args: any, context: any) {
            const _id = args._id;
            delete args._id;
            return await List.findOneAndUpdate({ _id: _id }, { $set: args }, { new: true })
        },
        async deleteList(_: any, { _id }: any, context: any): Promise<boolean> {
            const resp = await List.deleteOne({ _id });
            return resp.deletedCount > 0;
        },
    },
};
