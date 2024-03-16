import gql from "graphql-tag";
import { readFileSync } from "fs";
import path from "path";
import { Album, Author, Genre, List, Track } from "db";

export const types = gql(
    readFileSync(path.join(__dirname, "schema.graphql"), {
        encoding: "utf-8",
    })
);

export const resolvers = {
    Track: {
        id: (parent: any) => parent.id ?? parent._id,
    },
    Query: {
        async track(_: any, { _id }: any) {
            return await Track.findOne({ _id }, null, {
                populate: [
                    { path: "authors", model: Author, select: "-image" },
                    { path: "genres", model: Genre, select: "-thumbnail" },
                    { path: "lists", model: List, select: "-thumbnail" },
                    {
                        path: "album", model: Album, select: "-thumbnail",
                        populate: [
                            { path: "authors", model: Author, select: "-image" },
                            { path: "genres", model: Genre, select: "-thumbnail" },
                            { path: "lists", model: List, select: "-thumbnail" },
                        ]
                    }

                ]
            });
        },
        async tracks(_: any, __: any, context: any) {
            return await Track.find({}, {}, {
                populate: [

                    { path: "authors", model: Author, select: "-image" },
                    { path: "genres", model: Genre, select: "-thumbnail" },
                    { path: "lists", model: List, select: "-thumbnail" },
                    {
                        path: "album", model: Album, select: "-thumbnail",
                        populate: [
                            { path: "authors", model: Author, select: "-image" },
                            { path: "genres", model: Genre, select: "-thumbnail" },
                            { path: "lists", model: List, select: "-thumbnail" },
                        ]
                    }

                ]
            });
        },
    },
    Mutation: {
        async createTrack(_: any, args: any, context: any) {
            const track = await Track.create(args);
            return track;
        },
        async updateTrack(_: any, args: any, context: any) {
            const _id = args._id;
            delete args._id;
            return await Track.findOneAndUpdate({ _id: _id }, { $set: args }, { new: true })
        },
        async deleteTrack(_: any, { _id }: any, context: any): Promise<boolean> {
            const resp = await Track.deleteOne({ _id });
            return resp.deletedCount > 0;
        },
    },
};
