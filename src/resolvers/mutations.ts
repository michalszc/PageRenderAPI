import {
    Context, InputFieldError, ResultOrError,
    isUndefined, validate, validateEmpty,
    validateNotNull, validateUUID, validateUrl,
    wrappedError
} from '../utils';
import {
    Maybe, Page, MutationCreatePageArgs,
    MutationDeletePageArgs, MutationResolvers,
    MutationUpdatePageArgs
} from './../__generated__/resolvers-types';

const mutations: MutationResolvers = {
    createPage: async (
        _: unknown,
        { input }: MutationCreatePageArgs,
        { database }: Context
    ): Promise<ResultOrError<Page>> => {
        try {
            validate([
                validateUrl(input.site, 'input.site')
            ]);

            return await database.createPage(input);
        } catch (err) {
            return wrappedError(err);
        }
    },
    updatePage: async (
        _: unknown,
        { id, input }: MutationUpdatePageArgs,
        { database }: Context
    ): Promise<ResultOrError<Page>> => {
        try {
            const validations: Array<Maybe<InputFieldError>> = [];

            validations.push(validateUUID(id, 'id'));
            validations.push(validateEmpty(input, 'input'));

            if (!isUndefined(input.site)) {
                validations.push(
                    ...[
                        validateNotNull(input.site, 'input.site'),
                        validateUrl(input.site, 'input.site')
                    ]
                );
            }

            if (!isUndefined(input.type)) {
                validations.push(validateNotNull(input.type, 'input.type'));
            }

            validate(validations); // validate inputs

            return await database.updatePage(id, { ...input, file: 'file' });
        } catch (err) {
            return wrappedError(err);
        }
    },
    deletePage: async (
        _: unknown,
        { id }: MutationDeletePageArgs,
        { database }: Context
    ): Promise<ResultOrError<Page>> => {
        try {
            validate([
                validateUUID(id, 'id')
            ]);

            return await database.deletePage(id);
        } catch (err) {
            return wrappedError(err);
        }
    }
};

export default mutations;
