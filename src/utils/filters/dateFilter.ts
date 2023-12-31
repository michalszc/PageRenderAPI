import { DateFilter as DateFilterType } from './../../__generated__/resolvers-types';

export class DateFilter {
    // eslint-disable-next-line no-useless-constructor
    constructor(readonly dateFilter: DateFilterType) {}

    public exec(): string {
        if (this.dateFilter === undefined) {
            return null;
        }

        const filter: Array<string> = [];

        if ('gte' in this.dateFilter) {
            filter.push(`date >= '${this.dateFilter.gte}'`);
        } else if ('gt' in this.dateFilter) {
            filter.push(`date > '${this.dateFilter.gt}'`);
        }

        if ('lte' in this.dateFilter) {
            filter.push(`date <= '${this.dateFilter.lte}'`);
        } else if ('lt' in this.dateFilter) {
            filter.push(`date < '${this.dateFilter.lt}'`);
        }

        return filter.length < 1 ? null : filter.join(' AND ');
    }
}
