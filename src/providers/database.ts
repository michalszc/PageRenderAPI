import pg from 'pg';
import { Maybe, Page, PageFilterInput, PageInfo, PageSortInput, QueryPagesArgs } from '../__generated__/resolvers-types';
import { DateFilter, TypeEnumFilter } from '../utils';

export type AtLeastOne<T, U = {[K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];

export type IQueryOptions = Maybe<AtLeastOne<{
    filters: Array<string>,
    sort: string
}>>; 

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

}

export class Database implements IDatabase {
    private client: pg.Client = null;

    constructor() {
        this.client = new pg.Client();
    }

    private async connect(): Promise<void> {
        this.client = new pg.Client();
        return this.client.connect();
    }

    private async end(): Promise<void> {
        return this.client.end();
    }

    private async query(queryText: string, values: Array<any> = []): Promise<pg.QueryResult<any>> {
        let result: pg.QueryResult<any>;
        try {
            await this.connect();
            result = await this.client.query(queryText, values);
        } catch (err) {
            console.error(err);
        } finally {
            await this.end();
        }

        return result;
    }

    public async getPage(id: string): Promise<Page> {
        const result = await this.query('SELECT * FROM pages WHERE id = $1', [id]);
        const page: Page = result.rows[0];

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
        const options: IQueryOptions  = this.buildQueryOptions({sort, filter});
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
        const options: IQueryOptions  = this.buildQueryOptions({sort, filter});
        const result = await this.query('SELECT * FROM paginationInfo($1, $2, $3, $4, $5)', [
            first, last, before, after, options
        ]);
        const paginationinfo: PageInfo = result.rows.at(0)?.paginationinfo ?? null;
        
        return paginationinfo;
    }

}
