import { DateFilter } from '../../../src/utils';

describe('DateFilter', () => {
    test('should properly return filter - greater/less than', async () => {
        const gt = '2023-08-19';
        const lt = '2023-08-29';
        expect(new DateFilter({
            gt, lt
        }).exec()).toBe(`date > '${gt}' AND date < '${lt}'`);
    });

    test('should properly return filter - greater or equal/less or equal than', async () => {
        const gte = '2023-08-19';
        const lte = '2023-08-29';
        expect(new DateFilter({
            gte, lte
        }).exec()).toBe(`date >= '${gte}' AND date <= '${lte}'`);
    });

    test('should properly return filter - wider range', async () => {
        const gt = '2023-08-19';
        const gte = '2023-08-19';
        const lt = '2023-08-29';
        const lte = '2023-08-29';
        expect(new DateFilter({
            gt, gte, lt, lte
        }).exec()).toBe(`date >= '${gte}' AND date <= '${lte}'`);
    });
});
