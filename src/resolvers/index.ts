import { Resolvers } from '../__generated__/resolvers-types';
import { DateResolver, URLResolver, UUIDResolver } from 'graphql-scalars';
import queries from './queries';

export const resolvers: Resolvers = {
    // DateResolver,
    // URLResolver,
    // UUIDResolver,
    Query: queries,
    Mutation: {
      // more stuff here
    }
};
