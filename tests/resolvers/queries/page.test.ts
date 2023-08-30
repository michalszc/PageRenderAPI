import { main } from '../../../src/utils';
import supertest from 'supertest';

describe('Query > Page', () => {
    let request: supertest.SuperTest<supertest.Test>;
    const query = `
    query Query($pageId: UUID!) {
        page(id: $pageId) {
          ... on NotFoundError {
            message
          }
          ... on UnknownError {
            message
          }
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
        }
    }
    `;

    beforeAll(async () => {
        const app = await main();
        request = supertest(app);
    });

    test('should get page by id - SUCCESS', async () => {
        const queryData = {
            query,
            variables: { pageId: 'f2e6d8c1-9b3a-4e5f-a1d0-c7b9e8f2a6d3' }
        };

        const response = await request.post('/api/v1').send(queryData);
        expect(response.status).toBe(200);
        expect(response.body?.data).toMatchObject({
            page: {
                id: 'f2e6d8c1-9b3a-4e5f-a1d0-c7b9e8f2a6d3',
                type: 'JPEG',
                date: new Date('2023-08-20').toISOString(),
                site: 'https://testsite2.com',
                file: 'https://testsite2.com/files/picture3.jpeg'
            }
        });
    });

    test('should not get page by id - NOT FOUND ERROR', async () => {
        const queryData = {
            query,
            variables: { pageId: 'f2e6d8c1-9b3a-4e5f-a1d0-c7b9e8f2a6d9' }
        };

        const response = await request.post('/api/v1').send(queryData);
        expect(response.status).toBe(200);
        expect(response.body?.data).toMatchObject({
            page: {
                message: 'Page with f2e6d8c1-9b3a-4e5f-a1d0-c7b9e8f2a6d9 not found'
            }
        });
    });

    test('should not get page by id - INVALID INPUT ERROR', async () => {
        const queryData = {
            query,
            variables: { pageId: 'f2e6d8c1-9b3a-4e5f-a1d0-c7b9e8f2a6d' }
        };

        const response = await request.post('/api/v1').send(queryData);
        expect(response.status).toBe(200);
        expect(response.body?.data).toMatchObject({
            page: {
                message: 'Input validation failed for fields: [id]',
                inputs: [{
                    field: 'id',
                    message: 'f2e6d8c1-9b3a-4e5f-a1d0-c7b9e8f2a6d is not a valid UUID'
                }]
            }
        });
    });
});
