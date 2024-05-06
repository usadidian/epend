import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { ApiService } from "./api.service";

@Injectable({
    providedIn: "root",
})
export class AdminGuardService implements CanActivate {
    constructor(public auth: ApiService, public router: Router) {}

    canActivate(): boolean {
        // console.log(this.auth.isAdmin());
        if (!this.auth.isAdmin()) {
            this.router.navigate(["access"]);
            return false;
        }
        return true;
    }
}
