/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment */
import { CreatePageInput, Page, PageInfo, PageTypeEnum, QueryPagesArgs } from '../../__generated__/resolvers-types';
import dbJSON from '../../../tests/db.json';
import { IUpdateFields } from '../database';

export const page: Page = {
    id: 'f2e6d8c1-9b3a-4e5f-a1d0-c7b9e8f2a6d3',
    type: PageTypeEnum.Jpeg,
    date: '2023-08-20',
    site: 'https://testsite2.com',
    file: 'https://testsite2.com/files/picture3.jpeg'
};

export const getPage = jest.fn((id: string): Promise<Page> => Promise.resolve(page));

export const getPages = jest.fn(({
    after = null,
    before = null,
    first = null,
    last = null,
    filter = null,
    sort = null // @ts-ignore
}: QueryPagesArgs): Promise<Array<Page>> => dbJSON.data);

export const pageInfo: PageInfo = {
    hasNextPage: true,
    hasPreviousPage: true,
    startCursor: 'c6a2d269-9a9d-4e5e-a3f6-f792a4b8a1f0',
    endCursor: '6a1d8f0b-4c3e-2d1a-9f6b-8e7c5a3d0e9f'
};

export const getPageInfo = jest.fn(({
    after = null,
    before = null,
    first = null,
    last = null,
    filter = null,
    sort = null
}: QueryPagesArgs): Promise<PageInfo> => Promise.resolve(pageInfo));

export const createPage = jest.fn(({ site, type }: CreatePageInput) => Promise.resolve(page));

export const updatePage = jest.fn((id: string, updateFields: IUpdateFields) => Promise.resolve(page));

export const deletePage = jest.fn((id: string, updateFields: IUpdateFields) => Promise.resolve(page));

export const Database = jest.fn().mockImplementation(() => ({
    getPage,
    getPages,
    getPageInfo,
    createPage,
    updatePage,
    deletePage
}));
