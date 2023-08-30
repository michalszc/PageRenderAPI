import { Page, PageTypeEnum } from '../../src/__generated__/resolvers-types';
import { Database, IDatabase } from '../../src/providers';
import { pageInfo } from '../../src/providers/__mocks__/database';
import { NotFoundError } from '../../src/utils';

const connect = jest.fn();
const end = jest.fn();
const query = jest.fn();

jest.mock('pg', () => ({
    ...jest.requireActual('pg'),
    Client: jest.fn(() => ({
        connect,
        end,
        query
    }))
}));

describe('Database', () => {
    const database: IDatabase = new Database();

    beforeEach(() => {
        connect.mockClear();
        end.mockClear();
        query.mockClear();
    });

    test('should get page - SUCCESS', async () => {
        const page: Page = {
            id: 'f2e6d8c1-9b3a-4e5f-a1d0-c7b9e8f2a6d3',
            type: PageTypeEnum.Pdf,
            date: '2023-08-20',
            site: 'https://testsite2.com',
            file: 'https://testsite2.com/files/picture3.jpeg'
        };
        query.mockImplementation(() => ({ rows: [page] }));
        const id = 'f2e6d8c1-9b3a-4e5f-a1d0-c7b9e8f2a6d3';
        await expect(database.getPage(id)).resolves.toBe(page);

        expect(connect).toBeCalled();
        expect(end).toBeCalled();
        expect(query).toBeCalledWith('SELECT * FROM pages WHERE id = $1', [id]);
    });

    test('should get page - ERROR', async () => {
        query.mockImplementation(() => ({ rows: [] }));
        const id = 'f2e6d8c1-9b3a-4e5f-a1d0-c7b9e8f2a6d3';
        await expect(database.getPage(id)).rejects.toThrowError(NotFoundError);
        await expect(database.getPage(id)).rejects.toThrowError(`Page with ${id} not found`);

        expect(connect).toBeCalled();
        expect(end).toBeCalled();
        expect(query).toBeCalledWith('SELECT * FROM pages WHERE id = $1', [id]);
    });

    test('should get pages - SUCCESS', async () => {
        const pages: Array<Page> = [
            {
                id: 'f2e6d8c1-9b3a-4e5f-a1d0-c7b9e8f2a6d3',
                type: PageTypeEnum.Pdf,
                date: '2023-08-20',
                site: 'https://testsite2.com',
                file: 'https://testsite2.com/files/picture3.jpeg'
            },
            {
                id: '6a1d8f0b-4c3e-2d1a-9f6b-8e7c5a3d0e9f',
                type: PageTypeEnum.Pdf,
                date: '2023-08-19',
                site: 'https://sandbox2.com',
                file: 'https://sandbox2.com/files/file4.pdf'
            }
        ];
        query.mockImplementation(() => ({ rows: pages }));
        await expect(database.getPages({
            after: 'f2e6d8c1-9b3a-4e5f-a1d0-c7b9e8f2a6d3',
            first: 2,
            filter: {
                type: {
                    eq: PageTypeEnum.Pdf
                }
            }
        })).resolves.toBe(pages);

        expect(connect).toBeCalled();
        expect(end).toBeCalled();
        expect(query).toBeCalledWith('SELECT * FROM paginationSelect($1, $2, $3, $4, $5)', [
            2, null, null, 'f2e6d8c1-9b3a-4e5f-a1d0-c7b9e8f2a6d3', { filters: ["type = 'PDF'"] }
        ]);
    });

    test('should get page info - SUCCESS', async () => {
        query.mockImplementation(() => ({
            rows: [{
                paginationinfo: pageInfo
            }]
        }));
        await expect(database.getPageInfo({
            after: 'f2e6d8c1-9b3a-4e5f-a1d0-c7b9e8f2a6d3',
            first: 2,
            filter: {
                type: {
                    eq: PageTypeEnum.Pdf
                }
            }
        })).resolves.toBe(pageInfo);

        expect(connect).toBeCalled();
        expect(end).toBeCalled();
        expect(query).toBeCalledWith('SELECT * FROM paginationInfo($1, $2, $3, $4, $5)', [
            2, null, null, 'f2e6d8c1-9b3a-4e5f-a1d0-c7b9e8f2a6d3', { filters: ["type = 'PDF'"] }
        ]);
    });

    test('should create page - SUCCESS', async () => {
        const page: Page = {
            id: 'f2e6d8c1-9b3a-4e5f-a1d0-c7b9e8f2a6d3',
            type: PageTypeEnum.Pdf,
            date: '2023-08-20',
            site: 'https://testsite2.com',
            file: 'https://testsite2.com/files/picture3.jpeg'
        };
        query.mockImplementation(() => ({ rows: [page] }));
        await expect(database.createPage({
            site: 'http://example.com',
            type: PageTypeEnum.Pdf
        })).resolves.toBe(page);

        expect(connect).toBeCalled();
        expect(end).toBeCalled();
        expect(query).toBeCalledWith('INSERT INTO pages (type, site, file) VALUES ($1, $2, $3) RETURNING *', [
            'PDF', 'http://example.com', 'file'
        ]);
    });

    test('should update page - SUCCESS', async () => {
        const id = 'f2e6d8c1-9b3a-4e5f-a1d0-c7b9e8f2a6d3';
        const page: Page = {
            id,
            type: PageTypeEnum.Pdf,
            date: '2023-08-20',
            site: 'https://testsite2.com',
            file: 'https://testsite2.com/files/picture3.jpeg'
        };
        query.mockImplementation(() => ({ rows: [page] }));
        await expect(database.updatePage(id, {
            site: 'http://example.com',
            type: PageTypeEnum.Pdf
        })).resolves.toBe(page);

        expect(connect).toBeCalled();
        expect(end).toBeCalled(); // eslint-disable-next-line max-len
        expect(query).toBeCalledWith("UPDATE pages SET date = CURRENT_DATE, site = 'http://example.com',type = 'PDF' WHERE id = $1 RETURNING *", [
            id
        ]);
    });

    test('should update page - ERROR', async () => {
        const id = 'f2e6d8c1-9b3a-4e5f-a1d0-c7b9e8f2a6d3';
        query.mockImplementation(() => ({ rows: [] }));
        await expect(database.updatePage(id, {
            site: 'http://example.com',
            type: PageTypeEnum.Pdf
        })).rejects.toThrow(NotFoundError);
        await expect(database.updatePage(id, {
            site: 'http://example.com',
            type: PageTypeEnum.Pdf
        })).rejects.toThrow(`Page with ${id} not found`);

        expect(connect).toBeCalled();
        expect(end).toBeCalled(); // eslint-disable-next-line max-len
        expect(query).toBeCalledWith("UPDATE pages SET date = CURRENT_DATE, site = 'http://example.com',type = 'PDF' WHERE id = $1 RETURNING *", [
            id
        ]);
    });

    test('should delete page - SUCCESS', async () => {
        const id = 'f2e6d8c1-9b3a-4e5f-a1d0-c7b9e8f2a6d3';
        const page: Page = {
            id,
            type: PageTypeEnum.Pdf,
            date: '2023-08-20',
            site: 'https://testsite2.com',
            file: 'https://testsite2.com/files/picture3.jpeg'
        };
        query.mockImplementation(() => ({ rows: [page] }));
        await expect(database.deletePage(id)).resolves.toBe(page);

        expect(connect).toBeCalled();
        expect(end).toBeCalled();
        expect(query).toBeCalledWith('DELETE FROM pages WHERE id = $1 RETURNING *', [
            id
        ]);
    });

    test('should delete page - ERROR', async () => {
        const id = 'f2e6d8c1-9b3a-4e5f-a1d0-c7b9e8f2a6d3';
        query.mockImplementation(() => ({ rows: [] }));
        await expect(database.deletePage(id)).rejects.toThrow(NotFoundError);
        await expect(database.deletePage(id)).rejects.toThrow(`Page with ${id} not found`);

        expect(connect).toBeCalled();
        expect(end).toBeCalled();
        expect(query).toBeCalledWith('DELETE FROM pages WHERE id = $1 RETURNING *', [
            id
        ]);
    });
});
