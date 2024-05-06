import { Component, OnDestroy } from "@angular/core";
import { AppMainComponent } from "./app.main.component";
import { AppBreadcrumbService } from "./app.breadcrumb.service";
import { Subscription } from "rxjs";
import { MenuItem } from "primeng/api";
import { Router } from "@angular/router";
import { ApiService } from "./Services/api.service";

@Component({
    selector: "app-breadcrumb",
    templateUrl: "./app.breadcrumb.component.html",
})
export class AppBreadcrumbComponent implements OnDestroy {
    subscription: Subscription;

    items: MenuItem[];

    constructor(
        public breadcrumbService: AppBreadcrumbService,
        private router: Router,
        private apiService: ApiService
    ) {
        this.subscription = breadcrumbService.itemsHandler.subscribe(
            (response) => {
                this.items = response;
            }
        );
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    // logout() {
    //     // console.log(localStorage.hasOwnProperty('userInfo'));
    //     localStorage.removeItem('userInfo');
    //     localStorage.removeItem('userInfo');
    //     this.router.navigate(['/login']);
    // }

    logout() {
        this.apiService.logout().subscribe(
            (res) => {
                // console.log(localStorage.hasOwnProperty('userInfo'));
                localStorage.removeItem("userInfo");
                this.router.navigate(["/login"]);
            },
            (err) => {
                // console.log(localStorage.hasOwnProperty('userInfo'));
                localStorage.removeItem("userInfo");
                this.router.navigate(["/login"]);
            }
        );
    }
}
