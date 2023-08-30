import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { DateTypeDefinition, URLTypeDefinition, UUIDDefinition } from 'graphql-scalars';
import { expressMiddleware } from '@apollo/server/express4';
import { IDatabase, Database } from '../providers';
import { resolvers } from '../resolvers';
import bodyParser from 'body-parser';
import { readFileSync } from 'fs';
import express from 'express';
import cors from 'cors';
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

const typeDefs = readFileSync('./schema.graphql', { encoding: 'utf-8' });

export const createApolloServer = (httpServer: http.Server) => new ApolloServer<Context>({
    typeDefs: [
        DateTypeDefinition,
        URLTypeDefinition,
        UUIDDefinition,
        typeDefs
    ],
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
});

export async function main() {
    const app = express();
    const httpServer = http.createServer(app);

    const server = createApolloServer(httpServer);
    await server.start();

    app.use(
        '/api/v1',
        cors<cors.CorsRequest>(),
        bodyParser.json(),
        expressMiddleware(server, {
            context: async () => ({
                database: new Database()
            })
        })
    );

    if (process.env.NODE_ENV !== 'test') {
        // Modified server startup
        await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
        console.log('🚀 Server ready at http://localhost:4000/'); // eslint-disable-line no-console
    }

    return app;
}
