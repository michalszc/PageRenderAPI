import { Context } from '../utils';
import {
    MutationCreatePageArgs, MutationResolvers,
    Page, Result, ResultStatusEnum
} from './../__generated__/resolvers-types';

const mutations: MutationResolvers = {
    createPage: async (
        _: unknown,
        { input }: MutationCreatePageArgs,
        { database }: Context
    ): Promise<Result> => {
        const page: Page = await database.createPage(input);
        const result: Result = {
            affectedId: page.id,
            page,
            status: ResultStatusEnum.Success
        };

        return result;
    }
};

export default mutations;
