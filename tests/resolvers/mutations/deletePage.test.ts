import { main } from '../../../src/utils';
import supertest from 'supertest';

jest.mock('../../../src/providers/storage');

describe('Mutations > DeletePage', () => {
    let request: supertest.SuperTest<supertest.Test>;
    const query = `
        mutation DeletePage($deletePageId: UUID!) {
            deletePage(id: $deletePageId) {
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

    test('should delete page - SUCCESS', async () => {
        const queryData = {
            query,
            variables: {
                deletePageId: 'f2e6d8c1-9b3a-4e5f-a1d0-c7b9e8f2a6d3'
            }
        };

        const response = await request.post('/api/v1').set({ origin: 'http://localhost' }).send(queryData);
        expect(response.status).toBe(200);
        expect(response.body?.data).toMatchObject({
            deletePage: {
                id: 'f2e6d8c1-9b3a-4e5f-a1d0-c7b9e8f2a6d3',
                type: 'JPEG',
                date: expect.any(String),
                site: 'https://testsite2.com',
                file: 'http://localhost/file/782f7e3a-8ec3-4085-8ea4-178ed1eb7c8c'
            }
        });
    });

    test('should not delete page - NOT FOUND ERROR', async () => {
        const queryData = {
            query,
            variables: {
                deletePageId: 'f2e6d8c1-9b3a-4e5f-a1d0-c7b9e8f2a6d2'
            }
        };

        const response = await request.post('/api/v1').send(queryData);
        expect(response.status).toBe(200);
        expect(response.body?.data).toMatchObject({
            deletePage: {
                message: 'Page with f2e6d8c1-9b3a-4e5f-a1d0-c7b9e8f2a6d2 not found'
            }
        });
    });

    test('should not delete page - INVALID INPUT ERROR', async () => {
        const queryData = {
            query,
            variables: {
                deletePageId: 'f2e6d8c1-9b3a-4e5f-a1d0-c7b9e8f2a6d'
            }
        };

        const response = await request.post('/api/v1').send(queryData);
        expect(response.status).toBe(200);
        expect(response.body?.data).toMatchObject({
            deletePage: {
                message: 'Input validation failed for fields: [id]',
                inputs: [{
                    field: 'id',
                    message: 'f2e6d8c1-9b3a-4e5f-a1d0-c7b9e8f2a6d is not a valid UUID'
                }]
            }
        });
    });
});
