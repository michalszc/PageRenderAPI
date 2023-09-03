import { readFileSync } from 'fs';
import { DataType, newDb } from 'pg-mem';
import dbJSON from './db.json';
import { v4 } from 'uuid';

// Set environment variables
process.env.AWS_BUCKET = 'bucket';
process.env.AWS_REGION = 'eu-central-1';
process.env.AWS_ACCESS_KEY = 'access';
process.env.AWS_SECRET_KEY = 'secret';
process.env.AWS_S3_ENDPOINT = 'localhost';

global.console.error = jest.fn();
global.console.log = jest.fn();

const db = newDb();
db.registerExtension('uuid-ossp', (schema) => {
    schema.registerFunction({
        name: 'uuid_generate_v4',
        returns: DataType.uuid,
        implementation: v4,
        impure: true
    });
});

db.registerLanguage('plpgsql', () => {
    // Ignore implementation of custom functions
    return () => null;
});

// Initialize SQL database
const sql = readFileSync('./init.sql', { encoding: 'utf-8' });
db.public.none(sql);

// Insert data
const insertValues = dbJSON.data.map(({ id, type, date, site, file }) =>
    `('${id}', '${type}', '${date}', '${site}', '${file}')`
);
const query = `INSERT INTO pages (id, type, date, site, file) VALUES ${insertValues.join(', ')};`;
db.public.none(query);

jest.mock('pg', () => ({
    __esModule: true,
    default: {
        ...jest.requireActual('pg'),
        Client: db.adapters.createPg().Client
    }
}));
