import { main } from '../../../src/utils';
import supertest from 'supertest';

jest.mock('../../../src/providers/render');

describe('Mutations > UpdatePage', () => {
    let request: supertest.SuperTest<supertest.Test>;
    const query = `
        mutation Mutation($updatePageId: UUID!, $input: UpdatePageInput!) {
            updatePage(id: $updatePageId, input: $input) {
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

    test('should update page - SUCCESS', async () => {
        const queryData = {
            query,
            variables: {
                updatePageId: 'f2e6d8c1-9b3a-4e5f-a1d0-c7b9e8f2a6d3',
                input: {
                    site: 'https://example.com',
                    type: 'PDF'
                }
            }
        };

        const response = await request.post('/api/v1').send(queryData);
        expect(response.status).toBe(200);
        expect(response.body?.data).toMatchObject({
            updatePage: {
                id: expect.any(String),
                type: 'PDF',
                date: expect.any(String),
                site: 'https://example.com',
                file: 'file'
            }
        });
    });

    test('should not update page - NOT FOUND ERROR', async () => {
        const queryData = {
            query,
            variables: {
                updatePageId: 'f2e6d8c1-9b3a-4e5f-a1d0-c7b9e8f2a6d2',
                input: {
                    site: 'https://example.com',
                    type: 'PDF'
                }
            }
        };

        const response = await request.post('/api/v1').send(queryData);
        expect(response.status).toBe(200);
        expect(response.body?.data).toMatchObject({
            updatePage: {
                message: 'Page with f2e6d8c1-9b3a-4e5f-a1d0-c7b9e8f2a6d2 not found'
            }
        });
    });

    test('should not update page - INVALID INPUT ERROR', async () => {
        const queryData = {
            query,
            variables: {
                updatePageId: 'f2e6d8c1-9b3a-4e5f-a1d0-c7b9e8f2a6d',
                input: {
                    site: 'example',
                    type: 'PDF'
                }
            }
        };

        const response = await request.post('/api/v1').send(queryData);
        expect(response.status).toBe(200);
        expect(response.body?.data).toMatchObject({
            updatePage: {
                message: 'Input validation failed for fields: [id, input.site]',
                inputs: [
                    {
                        field: 'id',
                        message: 'f2e6d8c1-9b3a-4e5f-a1d0-c7b9e8f2a6d is not a valid UUID'
                    },
                    {
                        field: 'input.site',
                        message: 'example is not a valid URL'
                    }
                ]
            }
        });
    });
});
