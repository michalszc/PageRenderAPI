import { DateFilter as DateFilterType } from './../../__generated__/resolvers-types';

export class DateFilter {
    constructor(readonly dateFilter: DateFilterType) {}
    
    public exec(): string {
        if (this.dateFilter === undefined) {
            return null;
        }

        const filter: Array<string> = [];

        if ('gt' in this.dateFilter) {
            filter.push(`date > '${this.dateFilter.gt}'`);
        } else if ('gte' in this.dateFilter) {
            filter.push(`date >= '${this.dateFilter.gte}'`);
        }

        if ('lt' in this.dateFilter) {
            filter.push(`date < '${this.dateFilter.lt}'`);
        } else if ('lte' in this.dateFilter) {
            filter.push(`date <= '${this.dateFilter.lte}'`);
        }

        return filter.length < 1 ? null : filter.join(' AND ');
    }
}
