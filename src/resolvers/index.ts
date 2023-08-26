import { Resolvers } from '../__generated__/resolvers-types';
import mutations from './mutations';
import queries from './queries';

export const resolvers: Resolvers = {
    Query: queries,
    Mutation: mutations
};
