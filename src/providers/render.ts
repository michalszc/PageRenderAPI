import { launch, Browser, Page } from 'puppeteer';
import { CreatePageInput, PageTypeEnum } from '../__generated__/resolvers-types';
import { UnknownError } from '../utils';

export interface IRender {
    create: ({ site, type }: CreatePageInput) => Promise<Buffer>;
}

export class Render implements IRender {
    private browser: Browser;
    private page: Page;

    private createBrowser(): Promise<Browser> {
        return launch({
            headless: 'new', // Only when running in Docker
            ...(process.env?.DOCKER ? { // eslint-disable-line  multiline-ternary
                executablePath: '/usr/bin/chromium-browser', // Path to Chromium executable
                args: ['--no-sandbox', '--disable-setuid-sandbox'] // Add these flags to avoid sandbox issues
            } : {})
        });
    }

    private async createPage(website: string): Promise<Page> {
        // Create a new page
        const page = await this.browser.newPage();

        // Set viewport width and height
        await page.setViewport({ width: 1280, height: 720 });

        // Open URL in current page
        await page.goto(website, { waitUntil: 'networkidle0', timeout: 8000 });

        return page;
    }

    private screenshot(type: Exclude<PageTypeEnum, PageTypeEnum.Pdf>): Promise<Buffer> {
        return this.page.screenshot({
            fullPage: true,
            type: type.toLowerCase() as 'png' | 'jpeg' | 'webp'
        });
    }

    private pdf(): Promise<Buffer> {
        return this.page.pdf({
            printBackground: true
        });
    }

    public async create({ site, type }: CreatePageInput): Promise<Buffer> {
        let buffer: Buffer;
        try {
            this.browser = await this.createBrowser();
            this.page = await this.createPage(site);

            if (type === PageTypeEnum.Pdf) {
                buffer = await this.pdf();
            } else {
                buffer = await this.screenshot(type);
            }
        } catch (err) { // eslint-disable-next-line no-console
            console.error(err);
            throw new UnknownError('Unknown error occurred');
        } finally {
            await this.browser.close();
        }

        return buffer;
    }
}
