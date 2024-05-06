import { Pipe, PipeTransform } from "@angular/core";

import * as moment from "moment";

@Pipe({
    name: "momentFormat",
    pure: false,
})
export class MomentFormatPipe implements PipeTransform {
    transform(date: string, format: string = "YYYY-MM-DD HH:mm:ss"): string {
        return moment(date, format).lang("id").fromNow();
    }
}
