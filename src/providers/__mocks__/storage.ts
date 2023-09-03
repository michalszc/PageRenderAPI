/* eslint-disable @typescript-eslint/no-unused-vars */
import { CreatePageInput, PageTypeEnum } from '../../__generated__/resolvers-types';

export const uploadNew = jest.fn((buffer: Buffer, { site, type }: CreatePageInput) => Promise.resolve('key'));

export const uploadNewVersion = jest.fn((buffer: Buffer, type: PageTypeEnum, key: string) => Promise.resolve({}));

export const deleteFn = jest.fn((Key: string) => Promise.resolve({}));

export const generatePresignedURL = jest.fn((Key: string) => Promise.resolve('url'));

export const Storage = jest.fn().mockImplementation(() => ({
    uploadNew,
    uploadNewVersion,
    delete: deleteFn,
    generatePresignedURL
}));
