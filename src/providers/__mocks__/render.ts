import { CreatePageInput } from '../../__generated__/resolvers-types';

// eslint-disable-next-line  @typescript-eslint/no-unused-vars
export const create = jest.fn(({ site, type }: CreatePageInput) => Buffer.from('test', 'utf-8'));

export const Render = jest.fn().mockImplementation(() => ({
    create
}));
