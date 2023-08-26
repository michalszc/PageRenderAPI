import { Page, Pages } from './../__generated__/resolvers-types';
import { Context } from './../utils/setup';
import { QueryPageArgs, QueryPagesArgs, QueryResolvers, RequireFields } from "../__generated__/resolvers-types";

const queries: QueryResolvers = {
    page: async (
        _: unknown,
        { id }: RequireFields<QueryPageArgs, 'id'>,
        { database }: Context
    ): Promise<Page> => {
        return database.getPage(id);
    },
    pages: async (
        _: unknown,
        queryPagesArgs: Partial<QueryPagesArgs>,
        { database }: Context
    ): Promise<Pages> => {
        const pageArr: Array<Page> = await database.getPages(queryPagesArgs);
        const edges = (pageArr?.length > 0 ? pageArr : []).map((page: Page) => ({
            node: page,
            cursor: page.id
        }));

        const pageInfo = await database.getPageInfo(queryPagesArgs);
        const pages: Pages = {
            edges,
            pageInfo
        };

        return pages;
    },
};

export default queries;