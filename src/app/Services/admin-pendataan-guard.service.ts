import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { ApiService } from "./api.service";

@Injectable({
    providedIn: "root",
})
export class AdminPendataanGuardService implements CanActivate {
    constructor(public auth: ApiService, public router: Router) {}

    canActivate(): boolean {
        if (!this.auth.isAdminPendataan()) {
            this.router.navigate(["access"]);
            return false;
        }
        return true;
    }
}
