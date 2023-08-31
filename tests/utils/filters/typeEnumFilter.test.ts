import { PageTypeEnum } from '../../../src/__generated__/resolvers-types';
import { TypeEnumFilter } from '../../../src/utils';

describe('TypeEnumFilter', () => {
    test('should properly return filter - eq', () => {
        const eq = PageTypeEnum.Pdf;
        expect(new TypeEnumFilter({
            eq
        }).exec()).toBe(`type = '${eq}'`);
    });

    test('should properly return filter - ne', () => {
        const ne = PageTypeEnum.Pdf;
        expect(new TypeEnumFilter({
            ne
        }).exec()).toBe(`type <> '${ne}'`);
    });

    test('should properly return filter - in', () => {
        const _in = [PageTypeEnum.Pdf];
        expect(new TypeEnumFilter({
            in: _in
        }).exec()).toBe(`type IN (${_in.map(v => `'${v}'`).join(',')})`);
    });

    test('should properly return filter - nin', () => {
        const nin = [PageTypeEnum.Pdf];
        expect(new TypeEnumFilter({
            nin
        }).exec()).toBe(`type NOT IN (${nin.map(v => `'${v}'`).join(',')})`);
    });
});
