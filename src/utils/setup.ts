import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { DateTypeDefinition, URLTypeDefinition, UUIDDefinition } from 'graphql-scalars';
import { resolvers } from '../resolvers';
import { readFileSync } from "fs";
import { IDatabase } from '../providers';
import http from 'http';
import 'dotenv/config'; // Load environment variables
import pg from 'pg';

const types = pg.types;
types.setTypeParser(types.builtins.DATE, (value: string) => {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
});

export interface Context {
  database: IDatabase
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
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
});
