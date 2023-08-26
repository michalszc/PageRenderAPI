import { expressMiddleware } from '@apollo/server/express4';
import { createApolloServer } from './utils';
import bodyParser from 'body-parser';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { Database } from './providers';

const app = express();
const httpServer = http.createServer(app);

const database = new Database();

const server = createApolloServer(httpServer);
await server.start();

app.use(
    '/api/v1',
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server, {
        context: async () => ({ database })
    })
);

// Modified server startup
await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log('🚀 Server ready at http://localhost:4000/'); // eslint-disable-line no-console
