import { Component } from "@angular/core";
import { Location } from "@angular/common";
@Component({
    selector: "app-accessdenied",
    templateUrl: "./app.accessdenied.component.html",
})
export class AppAccessdeniedComponent {
    constructor(public location: Location) {}
}
