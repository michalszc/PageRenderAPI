import { main } from '../../../src/utils';
import supertest from 'supertest';

jest.mock('../../../src/providers/render');
jest.mock('../../../src/providers/storage');

describe('Mutations > CreatePage', () => {
    let request: supertest.SuperTest<supertest.Test>;
    const query = `
        mutation CreatePage($input: CreatePageInput!) {
            createPage(input: $input) {
              ... on Page {
                id
                type
                date
                site
                file
              }
              ... on InvalidInputError {
                message
                inputs {
                  field
                  message
                }
              }
              ... on NotFoundError {
                message
              }
              ... on UnknownError {
                message
              }
            }
        }
    `;

    beforeAll(async () => {
        const app = await main();
        request = supertest(app);
    });

    test('should create page - SUCCESS', async () => {
        const queryData = {
            query,
            variables: {
                input: {
                    site: 'https://example.com',
                    type: 'PDF'
                }
            }
        };

        const response = await request.post('/api/v1').set({ origin: 'http://localhost' }).send(queryData);
        expect(response.status).toBe(200);
        expect(response.body?.data).toMatchObject({
            createPage: {
                id: expect.any(String),
                type: 'PDF',
                date: expect.any(String),
                site: 'https://example.com',
                file: 'http://localhost/file/key'
            }
        });
    });

    test('should not create page - INVALID INPUT ERROR', async () => {
        const queryData = {
            query,
            variables: {
                input: {
                    site: 'example',
                    type: 'PDF'
                }
            }
        };

        const response = await request.post('/api/v1').send(queryData);
        expect(response.status).toBe(200);
        expect(response.body?.data).toMatchObject({
            createPage: {
                message: 'Input validation failed for fields: [input.site]',
                inputs: [{
                    field: 'input.site',
                    message: 'example is not a valid URL'
                }]
            }
        });
    });
});
