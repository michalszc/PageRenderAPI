import { IFilter } from ".";
import { PageTypeEnumFilter } from "../../__generated__/resolvers-types";

export class TypeEnumFilter implements IFilter {
    constructor(readonly typeFilter: PageTypeEnumFilter) {}
    
    public exec(): string {
        if (this.typeFilter === undefined) {
            return null;
        }

        switch (true) {
            case 'eq' in this.typeFilter:
                return `type = '${this.typeFilter.eq}'`;
            case 'ne' in this.typeFilter: 
                return `type <> '${this.typeFilter.ne}'`;
            case 'in' in this.typeFilter: 
                return `type IN (${this.typeFilter.in.map(v => `'${v}'`).join(',')})`;
            case 'nin' in this.typeFilter: 
                return `type NOT IN (${this.typeFilter.nin.map(v => `'${v}'`).join(',')})`;
            default:
                return null;
        }
    }
}
