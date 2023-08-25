import { Maybe } from '../../__generated__/resolvers-types';

export * from './typeEnumFilter';
export * from './dateFilter';

export interface IFilter {
    exec: () => Maybe<string>;
}
