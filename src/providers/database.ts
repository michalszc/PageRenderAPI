import pg from 'pg';
import {
    CreatePageInput, UpdatePageInput,
    Maybe, Page, PageFilterInput,
    PageInfo, PageSortInput, QueryPagesArgs
} from '../__generated__/resolvers-types';
import { DateFilter, TypeEnumFilter } from '../utils';
import { NotFoundError, UnknownError } from '../utils/errors';

export type AtLeastOne<T, U = {[K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];

export type IQueryOptions = Maybe<AtLeastOne<{
    filters: Array<string>,
    sort: string
}>>;

export interface IUpdateFields extends UpdatePageInput {
    file?: Maybe<string>;
}

export interface IDatabase {
    getPage: (id: string) => Promise<Page>;
    getPages: ({
        after = null,
        before = null,
        first = null,
        last = null,
        filter = null,
        sort = null
    }: QueryPagesArgs) => Promise<Array<Page>>;
    getPageInfo: ({
        after = null,
        before = null,
        first = null,
        last = null,
        filter = null,
        sort = null
    }: QueryPagesArgs) => Promise<PageInfo>;
    createPage: ({ site, type }: CreatePageInput) => Promise<Page>;
    updatePage: (id: string, updateFields: IUpdateFields) => Promise<Page>;
    deletePage: (id: string) => Promise<Page>;
}

export class Database implements IDatabase {
    private client: pg.Client = null;

    constructor() {
        this.client = new pg.Client();
    }

    private connect(): Promise<void> {
        this.client = new pg.Client();

        return this.client.connect();
    }

    private end(): Promise<void> {
        return this.client.end();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private async query(queryText: string, values: Array<any> = []): Promise<pg.QueryResult<any>> {
        let result: pg.QueryResult<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
        try {
            await this.connect();
            result = await this.client.query(queryText, values);
        } catch (err) { // eslint-disable-next-line no-console
            console.error(err);
            throw new UnknownError('Unknown error occurred');
        } finally {
            await this.end();
        }

        return result;
    }

    public async getPage(id: string): Promise<Page> {
        const result = await this.query('SELECT * FROM pages WHERE id = $1', [id]);
        const page: Page = result.rows.at(0) ?? null;

        if (page === null) {
            throw new NotFoundError(`Page with ${id} not found`);
        }

        return page;
    }

    private buildSort(sort: PageSortInput): string {
        return `${sort.field.toLowerCase()} ${sort.order}`;
    }

    private buildFilters(filter: PageFilterInput): Array<string> {
        const filters: Array<string> = [];

        const date = new DateFilter(filter.date).exec();
        if (date !== null) {
            filters.push(date);
        }

        const type = new TypeEnumFilter(filter.type).exec();
        if (type !== null) {
            filters.push(type);
        }

        return filters;
    }

    private buildQueryOptions({
        filter = null,
        sort = null
    }: {
        filter: PageFilterInput,
        sort: PageSortInput
    }): IQueryOptions {
        const sort_ = sort !== null ? this.buildSort(sort) : null;
        const filters = filter !== null ? this.buildFilters(filter) : null;

        if (filters === null && sort_ === null) {
            return null;
        } else if (filters === null) {
            return {
                sort: sort_
            };
        } else if (sort_ === null) {
            return {
                filters
            };
        } else {
            return {
                sort: sort_,
                filters
            };
        }
    }

    public async getPages({
        after = null,
        before = null,
        first = null,
        last = null,
        filter = null,
        sort = null
    }: QueryPagesArgs): Promise<Array<Page>> {
        const options: IQueryOptions = this.buildQueryOptions({ sort, filter });
        const result = await this.query('SELECT * FROM paginationSelect($1, $2, $3, $4, $5)', [
            first, last, before, after, options
        ]);
        const pages: Array<Page> = result.rows;

        return pages;
    }

    public async getPageInfo({
        after = null,
        before = null,
        first = null,
        last = null,
        filter = null,
        sort = null
    }: QueryPagesArgs): Promise<PageInfo> {
        const options: IQueryOptions = this.buildQueryOptions({ sort, filter });
        const result = await this.query('SELECT * FROM paginationInfo($1, $2, $3, $4, $5)', [
            first, last, before, after, options
        ]);
        const paginationinfo: PageInfo = result.rows.at(0)?.paginationinfo ?? null;

        if (paginationinfo === null) {
            throw new UnknownError('Could not get page info');
        }

        return paginationinfo;
    }

    public async createPage({ site, type }: CreatePageInput): Promise<Page> {
        const result = await this.query('INSERT INTO pages (type, site, file) VALUES ($1, $2, $3) RETURNING *', [
            type, site, 'file'
        ]);
        const page: Page = result.rows[0];

        return page;
    }

    private buildUpdateFields({ site = null, type = null, file = null }: IUpdateFields): string {
        const fields: Array<string> = [];

        if (site !== null) {
            fields.push(`site = '${site}'`);
        }

        if (type !== null) {
            fields.push(`type = '${type}'`);
        }

        if (file !== null) {
            fields.push(`file = '${file}'`);
        }

        return fields.join(',');
    }

    public async updatePage(id: string, updateFields: IUpdateFields): Promise<Page> {
        const update = this.buildUpdateFields(updateFields);
        const result = await this.query(`UPDATE pages SET date = CURRENT_DATE, ${update} WHERE id = $1 RETURNING *`, [
            id
        ]);
        const page: Page = result.rows.at(0) ?? null;

        if (page === null) {
            throw new NotFoundError(`Page with ${id} not found`);
        }

        return page;
    }

    public async deletePage(id: string): Promise<Page> {
        const result = await this.query('DELETE FROM pages WHERE id = $1 RETURNING *', [
            id
        ]);
        const page: Page = result.rows.at(0) ?? null;

        if (page === null) {
            throw new NotFoundError(`Page with ${id} not found`);
        }

        return page;
    }
}
