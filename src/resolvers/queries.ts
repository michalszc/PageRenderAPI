import { Maybe, Page, Pages } from './../__generated__/resolvers-types';
import { Context, isNil, validate, validateGreaterOrEqualThan0, validateNumber, validateUUID } from './../utils';
import { QueryPageArgs, QueryPagesArgs, QueryResolvers, RequireFields } from '../__generated__/resolvers-types';
import { InputFieldError, ResultOrError, wrappedError } from '../utils/errors';

const queries: QueryResolvers = {
    page: async (
        _: unknown,
        { id }: RequireFields<QueryPageArgs, 'id'>,
        { database }: Context
    ): Promise<ResultOrError<Page>> => {
        try {
            validate([
                validateUUID(id, 'id')
            ]);

            return await database.getPage(id);
        } catch (err) {
            return wrappedError(err);
        }
    },
    pages: async (
        _: unknown,
        queryPagesArgs: Partial<QueryPagesArgs>,
        { database }: Context
    ): Promise<ResultOrError<Pages>> => {
        try {
            const validations: Array<Maybe<InputFieldError>> = [];

            if (!isNil(queryPagesArgs.after)) {
                await database.getPage(queryPagesArgs.after);
                validations.push(validateUUID(queryPagesArgs.after, 'after'));
            }

            if (!isNil(queryPagesArgs.before)) {
                await database.getPage(queryPagesArgs.before);
                validations.push(validateUUID(queryPagesArgs.before, 'before'));
            }

            if (!isNil(queryPagesArgs.first)) {
                validations.push(
                    ...[
                        validateNumber(queryPagesArgs.first, 'first'),
                        validateGreaterOrEqualThan0(queryPagesArgs.first, 'first')
                    ]
                );
            }

            if (!isNil(queryPagesArgs.last)) {
                validations.push(
                    ...[
                        validateNumber(queryPagesArgs.last, 'last'),
                        validateGreaterOrEqualThan0(queryPagesArgs.last, 'last')
                    ]
                );
            }

            validate(validations);

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
        } catch (err) {
            return wrappedError(err);
        }
    }
};

export default queries;
