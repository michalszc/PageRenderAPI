import { Context } from '../utils';
import {
    MutationCreatePageArgs, MutationDeletePageArgs, MutationResolvers,
    MutationUpdatePageArgs,
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
    },
    updatePage: async (
        _: unknown,
        { id, input }: MutationUpdatePageArgs,
        { database }: Context
    ): Promise<Result> => {
        const page: Page = await database.updatePage(id, input);
        const result: Result = {
            affectedId: page.id,
            page,
            status: ResultStatusEnum.Success
        };

        return result;
    },
    deletePage: async (
        _: unknown,
        { id }: MutationDeletePageArgs,
        { database }: Context
    ): Promise<Result> => {
        const page: Page = await database.deletePage(id);
        const result: Result = {
            affectedId: page.id,
            page,
            status: ResultStatusEnum.Success
        };

        return result;
    }
};

export default mutations;
