import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { ApiService } from "./api.service";

@Injectable({
    providedIn: "root",
})
export class AuthGuardService implements CanActivate {
    constructor(public auth: ApiService, public router: Router) {}

    canActivate(): boolean {
        if (!this.auth.isAuthenticated()) {
            this.router.navigate(["login"]);
            return false;
        }
        // if (!localStorage.getItem('userInfo')) {
        //   this.router.navigate(['login']);
        //   return false;
        // }
        return true;
    }
}
