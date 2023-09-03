import {
    S3Client, PutObjectCommand, GetObjectCommand,
    PutObjectCommandOutput, DeleteObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { CreatePageInput, PageTypeEnum } from '../__generated__/resolvers-types';
import { UnknownError } from '../utils';
import { v4, v5 } from 'uuid';

export enum MimeTypeEnum {
    JPEG = 'image/jpeg',
    PDF = 'application/pdf',
    PNG = 'image/png',
    WEBP = 'image/webp'
}

export interface IStorage {
    uploadNew: (buffer: Buffer, { site, type }: CreatePageInput) => Promise<string>;
    uploadNewVersion: (buffer: Buffer, type: PageTypeEnum, key: string) => Promise<void>;
    delete: (Key: string) => Promise<void>;
    generatePresignedURL: (Key: string) => Promise<string>;
}

export class Storage implements IStorage {
    private client: S3Client;
    constructor() {
        this.client = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_KEY
            },
            endpoint: process.env.AWS_S3_ENDPOINT,
            forcePathStyle: true
        });
    }

    private getContentType(type: PageTypeEnum): MimeTypeEnum {
        switch (type) {
        case PageTypeEnum.Jpeg:
            return MimeTypeEnum.JPEG;
        case PageTypeEnum.Pdf:
            return MimeTypeEnum.PDF;
        case PageTypeEnum.Png:
            return MimeTypeEnum.PNG;
        case PageTypeEnum.Webp:
            return MimeTypeEnum.WEBP;
        }
    }

    private generateKey(site: string): string {
        return v5(site, v4());
    }

    private upload(buffer: Buffer, Key: string, ContentType: string): Promise<PutObjectCommandOutput> {
        const command = new PutObjectCommand({
            ACL: 'private',
            Bucket: process.env.AWS_BUCKET,
            Body: buffer,
            Key,
            ContentType
        });

        return this.client.send(command);
    }

    public async uploadNew(buffer: Buffer, { site, type }: CreatePageInput): Promise<string> {
        const key = this.generateKey(site);

        try {
            await this.upload(
                buffer,
                key,
                this.getContentType(type)
            );
        } catch (err) { // eslint-disable-next-line no-console
            console.error(err);
            throw new UnknownError('Unknown error occurred');
        }

        return key;
    }

    public async uploadNewVersion(buffer: Buffer, type: PageTypeEnum, key: string): Promise<void> {
        try {
            await this.upload(
                buffer,
                key,
                this.getContentType(type)
            );
        } catch (err) { // eslint-disable-next-line no-console
            console.error(err);
            throw new UnknownError('Unknown error occurred');
        }
    }

    public async delete(Key: string): Promise<void> {
        try {
            const command = new DeleteObjectCommand({
                Bucket: process.env.AWS_BUCKET,
                Key
            });

            await this.client.send(command);
        } catch (err) { // eslint-disable-next-line no-console
            console.error(err);
            throw new UnknownError('Unknown error occurred');
        }
    }

    public generatePresignedURL(Key: string): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET,
            Key
        });

        return getSignedUrl(this.client, command, { expiresIn: 3600 });
    }
}
