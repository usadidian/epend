import { Component, OnInit } from "@angular/core";
import { AppMainComponent } from "./app.main.component";
import { MenuService } from "./app.menu.service";
@Component({
    selector: "app-menu",
    template: `
        <ul class="ultima-menu ultima-main-menu clearfix">
            <li
                app-menuitem
                *ngFor="let item of menuService.datas$ | async; let i = index"
                [item]="item"
                [index]="i"
                [root]="true"
            ></li>
        </ul>
    `,
})
export class AppMenuComponent implements OnInit {
    model: any[];
    userType: any;

    constructor(public app: AppMainComponent, public menuService: MenuService) {
        // this.authService.userType.subscribe((value) => {
        //     this.userType = value;
        //     this.setMenu();
        // });
        this.menuService.initMenu();
    }

    ngOnInit() {
        
    }
}
