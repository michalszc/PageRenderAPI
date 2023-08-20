import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { DateTypeDefinition, URLTypeDefinition, UUIDDefinition } from 'graphql-scalars';
import { resolvers } from '../resolvers';
import { readFileSync } from "fs";
import http from 'http';

export interface Context {
    token?: string;
}

const typeDefs = readFileSync("./schema.graphql", { encoding: "utf-8" });

export const createApolloServer = (httpServer: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>) => new ApolloServer<Context>({
    typeDefs: [
        DateTypeDefinition,
        URLTypeDefinition,
        UUIDDefinition,
        typeDefs
    ],
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
