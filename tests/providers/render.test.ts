import { PageTypeEnum } from '../../src/__generated__/resolvers-types';
import { Render, IRender } from '../../src/providers';

const screenshot = jest.fn().mockResolvedValue({});
const pdf = jest.fn().mockResolvedValue({});
const goto = jest.fn().mockResolvedValue({});
const setViewport = jest.fn().mockResolvedValue({});
const newPage = jest.fn().mockResolvedValue({
    setViewport,
    goto,
    screenshot,
    pdf
});
const close = jest.fn().mockResolvedValue({});

jest.mock('puppeteer', () => ({
    launch: jest.fn(() => Promise.resolve({
        newPage,
        close
    }))
}));

describe('Render', () => {
    const render: IRender = new Render();

    beforeEach(() => {
        close.mockClear();
        goto.mockClear();
        screenshot.mockClear();
        pdf.mockClear();
        setViewport.mockClear();
        newPage.mockClear();
    });

    test('should create buffer from page - PDF', async () => {
        await render.create({ site: 'site', type: PageTypeEnum.Pdf });

        expect(newPage).toBeCalled();
        expect(setViewport).toBeCalled();
        expect(goto).toBeCalledWith('site', { waitUntil: 'networkidle0', timeout: 8000 });
        expect(pdf).toBeCalled();
        expect(close).toBeCalled();
    });

    test('should create buffer from page - PNG', async () => {
        await render.create({ site: 'site', type: PageTypeEnum.Png });

        expect(newPage).toBeCalled();
        expect(setViewport).toBeCalled();
        expect(goto).toBeCalledWith('site', { waitUntil: 'networkidle0', timeout: 8000 });
        expect(screenshot).toBeCalled();
        expect(close).toBeCalled();
    });

    test('should create buffer from page - JPEG', async () => {
        await render.create({ site: 'site', type: PageTypeEnum.Jpeg });

        expect(newPage).toBeCalled();
        expect(setViewport).toBeCalled();
        expect(goto).toBeCalledWith('site', { waitUntil: 'networkidle0', timeout: 8000 });
        expect(screenshot).toBeCalled();
        expect(close).toBeCalled();
    });

    test('should create buffer from page - WEBP', async () => {
        await render.create({ site: 'site', type: PageTypeEnum.Webp });

        expect(newPage).toBeCalled();
        expect(setViewport).toBeCalled();
        expect(goto).toBeCalledWith('site', { waitUntil: 'networkidle0', timeout: 8000 });
        expect(screenshot).toBeCalled();
        expect(close).toBeCalled();
    });
});
