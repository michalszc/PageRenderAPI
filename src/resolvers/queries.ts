import { Maybe, Page, Pages } from './../__generated__/resolvers-types';
import {
    Context, isNotNull, isUndefined,
    validate, validateDate, validateInRange,
    validateLength, validateNotNull, validateNumber,
    validateUUID
} from './../utils';
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

            if (!isUndefined(queryPagesArgs.after)) {
                validations.push(
                    ...[
                        validateNotNull(queryPagesArgs.after, 'after'),
                        validateUUID(queryPagesArgs.after, 'after')
                    ]
                );
            }

            if (!isUndefined(queryPagesArgs.before)) {
                validations.push(
                    ...[
                        validateNotNull(queryPagesArgs.before, 'before'),
                        validateUUID(queryPagesArgs.before, 'before')
                    ]
                );
            }

            if (!isUndefined(queryPagesArgs.first)) {
                validations.push(
                    ...[
                        validateNotNull(queryPagesArgs.first, 'first'),
                        validateNumber(queryPagesArgs.first, 'first'),
                        validateInRange(queryPagesArgs.first, 'first', {
                            min: 0, max: 10000
                        })
                    ]
                );
            }

            if (!isUndefined(queryPagesArgs.last)) {
                validations.push(
                    ...[
                        validateNotNull(queryPagesArgs.last, 'last'),
                        validateNumber(queryPagesArgs.last, 'last'),
                        validateInRange(queryPagesArgs.last, 'last', {
                            min: 0, max: 10000
                        })
                    ]
                );
            }

            if (!isUndefined(queryPagesArgs.filter)) {
                validations.push(validateNotNull(queryPagesArgs.filter, 'filter'));

                if (!isUndefined(queryPagesArgs.filter.date)) {
                    validations.push(validateNotNull(queryPagesArgs.filter.date, 'filter.date'));

                    if (isNotNull(queryPagesArgs.filter.date)) {
                        for (const [key, value] of Object.entries(queryPagesArgs.filter.date)) {
                            validations.push(
                                ...[
                                    validateNotNull(value, `filter.date.${key}`),
                                    validateDate(value, `filter.date.${key}`)
                                ]
                            );
                        }
                    }
                }

                if (!isUndefined(queryPagesArgs.filter.type)) {
                    validations.push(validateNotNull(queryPagesArgs.filter.type, 'filter.type'));

                    if (isNotNull(queryPagesArgs.filter.type)) {
                        for (const [key, value] of Object.entries(queryPagesArgs.filter.type)) {
                            validations.push(validateNotNull(value, `filter.type.${key}`));

                            if (key.endsWith('in')) {
                                validations.push(validateLength(value, `filter.type.${key}`, {
                                    min: 1
                                }));
                            }
                        }
                    }
                }
            }

            if (!isUndefined(queryPagesArgs.sort)) {
                validations.push(validateNotNull(queryPagesArgs.sort, 'sort'));
            }

            validate(validations); // validate inputs

            // Check if UUIDs passed exist
            if (!isUndefined(queryPagesArgs.after)) {
                await database.getPage(queryPagesArgs.after);
            } else if (!isUndefined(queryPagesArgs.before)) {
                await database.getPage(queryPagesArgs.before);
            }

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
