import path from "path";
import fs from "fs";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { ApolloServer } from "@apollo/server";
import { buildSubgraphSchema } from "@apollo/subgraph";
import AuthDirective from "./directives/AuthDirective";
import { makeExecutableSchema } from '@graphql-tools/schema'
const load = async () => {
    const types = [
        fs.readFileSync(path.join(__dirname, "schema.graphql").replace("/dist", "/src"), {
            encoding: "utf-8",
        })
    ];
    const resolvers = [];
    const folder = path.resolve(path.join(__dirname, "resolvers"))
    const dirs = fs.readdirSync(folder);
    for (const dir of dirs) {
        const module = await import(path.join(folder, dir, "index"));
        types.push(
            fs.readFileSync(path.join(folder, dir, "schema.graphql").replace("/dist", "/src"), {
                encoding: "utf-8",
            })
        );
        resolvers.push(module.default);
    }

    return { resolvers, types };
}
export const init = async () => {
    const { types, resolvers } = await load();
    const { authDirectiveTransformer, authDirectiveTypeDefs } = AuthDirective;
    const typeDefs = mergeTypeDefs([...types, authDirectiveTypeDefs]);
    const server = new ApolloServer({
        schema: authDirectiveTransformer(
            makeExecutableSchema({
                typeDefs: typeDefs,
                resolvers: mergeResolvers(resolvers) as any,

            }),
        ),
    });

    await server.start();
    return server;
}