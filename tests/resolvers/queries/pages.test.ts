import { pageInfo } from './../../../src/providers/__mocks__/database';
import { Page, Pages } from '../../../src/__generated__/resolvers-types';
import { main } from '../../../src/utils';
import dbJSON from '../../db.json';
import supertest from 'supertest';

jest.mock('../../../src/providers/database');

describe('Query > Pages', () => {
    let request: supertest.SuperTest<supertest.Test>;
    let pages: Pages;

    beforeAll(async () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const edges = dbJSON.data.map((page: Page) => ({
            cursor: page.id,
            node: page
        }));

        pages = {
            edges,
            pageInfo
        };

        const app = await main();
        request = supertest(app);
    });

    test('should get all pages - SUCCESS', async () => {
        const queryData = {
            query: `
                query Pages {
                    pages {
                      ... on Pages {
                        edges {
                          node {
                            id
                            type
                            date
                            site
                            file
                          }
                          cursor
                        }
                        pageInfo {
                          hasNextPage
                          hasPreviousPage
                          startCursor
                          endCursor
                        }
                      }
                      ... on InvalidInputError {
                        message
                        inputs {
                          field
                          message
                        }
                      }
                      ... on UnknownError {
                        message
                      }
                    }
                }
            `
        };

        const response = await request.post('/api/v1').send(queryData);
        expect(response.status).toBe(200);
        expect(response.body?.data).toMatchObject({
            pages
        });
    });

    test('should not get all pages - INVALID INPUT ERROR', async () => {
        const queryData = {
            query: `
                query Pages($before: UUID, $last: Int) {
                  pages(before: $before, last: $last) {
                    ... on Pages {
                      edges {
                        node {
                          id
                          type
                          date
                          site
                          file
                        }
                        cursor
                      }
                      pageInfo {
                        hasNextPage
                        hasPreviousPage
                        startCursor
                        endCursor
                      }
                    }
                    ... on InvalidInputError {
                      message
                      inputs {
                        field
                        message
                      }
                    }
                    ... on UnknownError {
                      message
                    }
                  }
                }
            `,
            variables: { before: null, last: -1 }
        };

        const response = await request.post('/api/v1').send(queryData);
        expect(response.status).toBe(200);
        expect(response.body?.data).toMatchObject({
            pages: {
                message: 'Input validation failed for fields: [before, last]',
                inputs: [
                    {
                        field: 'before',
                        message: 'null is not a valid value'
                    },
                    {
                        field: 'before',
                        message: 'null is not a valid UUID'
                    },
                    {
                        field: 'last',
                        message: '-1 should be greater than or equal 0'
                    }
                ]
            }
        });
    });
});
