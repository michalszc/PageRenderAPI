import { Resolvers } from '../__generated__/resolvers-types';
import queries from './queries';

export const resolvers: Resolvers = {
    Query: queries,
    Mutation: {
    // more stuff here
    }
};
