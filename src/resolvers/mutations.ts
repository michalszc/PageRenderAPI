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
        { url, database, render, storage }: Context
    ): Promise<ResultOrError<Page>> => {
        try {
            validate([
                validateUrl(input.site, 'input.site')
            ]);

            // Create buffer
            const buffer = await render.create(input);

            // Upload file to s3
            const key = await storage.uploadNew(buffer, input);

            const page: Page = await database.createPage({
                ...input, file: key
            });
            page.file = `${url}/${page.file}`;

            return page;
        } catch (err) {
            return wrappedError(err);
        }
    },
    updatePage: async (
        _: unknown,
        { id, input }: MutationUpdatePageArgs,
        { url, database, render, storage }: Context
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

            const page: Page = await database.getPage(id);

            // Create buffer
            const buffer = await render.create({
                site: page.site,
                type: page.type,
                ...input
            });

            // Upload new file version to s3
            await storage.uploadNewVersion(buffer, input.type ?? page.type, page.file);

            const updatedPage: Page = await database.updatePage(id, { ...input });
            updatedPage.file = `${url}/${updatedPage.file}`;

            return updatedPage;
        } catch (err) {
            return wrappedError(err);
        }
    },
    deletePage: async (
        _: unknown,
        { id }: MutationDeletePageArgs,
        { url, database, storage }: Context
    ): Promise<ResultOrError<Page>> => {
        try {
            validate([
                validateUUID(id, 'id')
            ]);

            const page: Page = await database.deletePage(id);

            // Delete file from s3
            await storage.delete(page.file);

            page.file = `${url}/${page.file}`;

            return page;
        } catch (err) {
            return wrappedError(err);
        }
    }
};

export default mutations;
