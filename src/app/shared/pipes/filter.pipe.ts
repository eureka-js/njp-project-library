import { Pipe, PipeTransform } from "@angular/core";


@Pipe({
    name: "filter",
    pure: false
})
export class FilterPipe implements PipeTransform {
    transform(items: any[], in_fields: string, value: any): any {
        let fields = in_fields.split('.');

        return items.filter(el => this.getField(el, fields) == value);
    }

    getField(el: any, fields: string[]): any {
        for (let field of fields) {
            if (el === undefined) {
                break;
            }
            
            el = el[field];
        }

        return el;
    }
};
