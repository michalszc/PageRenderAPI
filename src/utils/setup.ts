import { IStorage, Storage } from './../providers/storage';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { DateTypeDefinition, URLTypeDefinition, UUIDDefinition } from 'graphql-scalars';
import { expressMiddleware } from '@apollo/server/express4';
import { IDatabase, Database, Render, IRender } from '../providers';
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
  database: IDatabase;
  render: IRender;
  storage: IStorage;
  url: string;
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

    const storage = new Storage();

    // Route for getting files from s3
    app.use('/file/:key', async (req, res) => {
        const key = req.params.key;
        const url = await storage.generatePresignedURL(key);

        // Only when running in Docker and using localstack
        if (process.env?.LOCALSTACK && process.env?.DOCKER) {
            res.status(301).redirect(url.replace('localstack', 'localhost'));
        } else {
            res.status(301).redirect(url);
        }
    });

    app.use(
        '/api/v1',
        cors<cors.CorsRequest>(),
        bodyParser.json(),
        expressMiddleware(server, {
            context: async ({ req }) => ({ // eslint-disable-line require-await
                database: new Database(),
                render: new Render(),
                storage,
                url: `${req.headers.origin}/file`
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
