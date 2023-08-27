import { Resolvers, Page, Pages } from '../__generated__/resolvers-types';
import mutations from './mutations';
import queries from './queries';
import {
    InvalidInputError, NotFoundError, UnknownError,
    errorTypesCommonResolvers, wrappedErrorField
} from '../utils/errors';

export const resolvers: Resolvers = {
    Query: queries,
    Mutation: mutations,
    NotFoundError: errorTypesCommonResolvers(NotFoundError),
    UnknownError: errorTypesCommonResolvers(UnknownError),
    InvalidInputError: {
        ...errorTypesCommonResolvers(InvalidInputError),
        inputs: wrappedErrorField(InvalidInputError)('validations')
    },
    Page: {
        __isTypeOf: (parent) => (<Page>parent).id !== undefined,
        id: (parent) => parent.id,
        type: (parent) => parent.type,
        date: (parent) => parent.date,
        site: (parent) => parent.site,
        file: (parent) => parent.file
    },
    Pages: {
        __isTypeOf: (parent) => (<Pages>parent).edges !== undefined,
        edges: (parent) => parent.edges,
        pageInfo: (parent) => parent.pageInfo
    }
};
