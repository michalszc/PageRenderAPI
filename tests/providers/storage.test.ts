import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { PageTypeEnum } from '../../src/__generated__/resolvers-types';
import { Storage, IStorage } from '../../src/providers';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { UnknownError } from '../../src/utils';

const send = jest.fn().mockResolvedValue({});

jest.mock('@aws-sdk/client-s3', () => ({
    S3Client: jest.fn(() => ({
        send
    })),
    PutObjectCommand: jest.fn(),
    GetObjectCommand: jest.fn(),
    DeleteObjectCommand: jest.fn()
}));

jest.mock('@aws-sdk/s3-request-presigner', () => ({
    getSignedUrl: jest.fn()
}));

describe('Storage', () => {
    const storage: IStorage = new Storage();
    const buffer = Buffer.from('test', 'utf-8');

    beforeEach(() => {
        send.mockClear();
        (S3Client as unknown as jest.Mock).mockClear();
        (PutObjectCommand as unknown as jest.Mock).mockClear();
        (GetObjectCommand as unknown as jest.Mock).mockClear();
        (DeleteObjectCommand as unknown as jest.Mock).mockClear();
        (getSignedUrl as unknown as jest.Mock).mockClear();
    });

    test('should upload a new file - SUCCESS', async () => {
        const Key = await storage.uploadNew(buffer, {
            site: 'site',
            type: PageTypeEnum.Pdf
        });

        expect(PutObjectCommand).toBeCalledWith({
            Bucket: 'bucket',
            Body: buffer,
            Key,
            ContentType: 'application/pdf'
        });
        expect(send).toBeCalled();
    });

    test('should upload a new file - ERROR', async () => {
        send.mockRejectedValueOnce(new Error());

        await expect(storage.uploadNew(buffer, {
            site: 'site',
            type: PageTypeEnum.Pdf
        })).rejects.toThrowError(UnknownError);

        expect(PutObjectCommand).toBeCalledWith({
            Bucket: 'bucket',
            Body: buffer,
            Key: expect.any(String),
            ContentType: 'application/pdf'
        });
        expect(send).toBeCalled();
    });

    test('should upload a new version of the file - SUCCESS', async () => {
        const key = 'a26f6910-1010-42f5-92a4-77e3b88eb5b0';

        await storage.uploadNewVersion(buffer, PageTypeEnum.Webp, key);

        expect(PutObjectCommand).toBeCalledWith({
            Bucket: 'bucket',
            Body: buffer,
            Key: key,
            ContentType: 'image/webp'
        });
        expect(send).toBeCalled();
    });

    test('should upload a new version of the file - ERROR', async () => {
        send.mockRejectedValueOnce(new Error());

        const key = 'a26f6910-1010-42f5-92a4-77e3b88eb5b0';

        await expect(
            storage.uploadNewVersion(buffer, PageTypeEnum.Webp, key)
        ).rejects.toThrowError(UnknownError);

        expect(PutObjectCommand).toBeCalledWith({
            Bucket: 'bucket',
            Body: buffer,
            Key: key,
            ContentType: 'image/webp'
        });
        expect(send).toBeCalled();
    });

    test('should delete a file - SUCCESS', async () => {
        const key = 'a26f6910-1010-42f5-92a4-77e3b88eb5b0';

        await storage.delete(key);

        expect(DeleteObjectCommand).toBeCalledWith({
            Bucket: 'bucket',
            Key: key
        });
        expect(send).toBeCalled();
    });

    test('should delete a file - ERROR', async () => {
        send.mockRejectedValueOnce(new Error());

        const key = 'a26f6910-1010-42f5-92a4-77e3b88eb5b0';

        await expect(storage.delete(key)).rejects.toThrowError(UnknownError);

        expect(DeleteObjectCommand).toBeCalledWith({
            Bucket: 'bucket',
            Key: key
        });
        expect(send).toBeCalled();
    });

    test('should generate presigned URL for the file', async () => {
        const key = 'a26f6910-1010-42f5-92a4-77e3b88eb5b0';

        await storage.generatePresignedURL(key);

        const getObejectArg = {
            Bucket: 'bucket',
            Key: key
        };
        expect(GetObjectCommand).toBeCalledWith(getObejectArg);
        expect(getSignedUrl).toBeCalledWith(new S3Client(), new GetObjectCommand(getObejectArg), { expiresIn: 3600 });
    });
});
