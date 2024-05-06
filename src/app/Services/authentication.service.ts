import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { ApiService } from "./api.service";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
    providedIn: "root",
})
export class AuthenticationService {
    constructor(
        public auth: ApiService,
        public router: Router,
        private jwtHelper: JwtHelperService
    ) {}

    userInfo: BehaviorSubject<any> = new BehaviorSubject<any>(
        this.getUserInfo()
    );

    userType: BehaviorSubject<any> = new BehaviorSubject<any>(
        this.getUserType()
    );

    getUserType() {
        return this.getTokenData();
    }

    getTokenData() {
        try {
            const store = localStorage.getItem("userInfo");
            const token = JSON.parse(store)["APIkey"];
            const decodedToken = this.jwtHelper.decodeToken(token);
            return decodedToken;
        } catch (error) {
            return {};
        }
    }

    getUserInfo() {
        try {
            const store = localStorage.getItem("userInfo");
            const storeObj = JSON.parse(store);
            return storeObj;
        } catch (error) {
            return {};
        }
    }

    async putUserInfo(data: any) {
        try {
            const store = localStorage.getItem("userInfo");
            const storeObj = JSON.parse(store);
            storeObj["Avatar"] = await data["Avatar"];
            localStorage.setItem("userInfo", JSON.stringify(storeObj));
            return storeObj;
        } catch (error) {
            return {};
        }
    }
}
