import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../Services/api.service";
import { environment } from "src/environments/environment";
import { AuthenticationService } from "../Services/authentication.service";
import { JwtHelperService } from "@auth0/angular-jwt";
import { MenuService } from "../app.menu.service";
import { Title } from "@angular/platform-browser";
import { AppService } from '../services/app.service';
import { toText } from "@amcharts/amcharts4/.internal/core/utils/Type";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
    user: any = {};
    isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );
    submitted: boolean = false;
    isLoading: boolean = false;
    displayError: boolean;
    displayErrorWP: boolean;
    currentLoginMethod: string = "userid";
    // currentLoginMethodName: string = "Email";
    // loginUser: string = "userid";
    // loginPhone: string = "phone";
    environmentData: any = environment;
    originUrl: string;
    errorMessage: string =
        "Login gagal. email atau password yang anda masukan mungkin salah.";
    urlWp: string = "";
    password;

    show = false;

    constructor(
        private api: ApiService,
        private router: Router,
        private authenticationService: AuthenticationService,
        private menuService: MenuService,
        private route: ActivatedRoute,
        private titleService: Title,
        private appService: AppService

    ) {
        let isUserInfo = localStorage.hasOwnProperty("userInfo");
        if (isUserInfo) {
            localStorage.removeItem("userInfo");
        }
        sessionStorage.clear();
        this.originUrl =
            this.router.getCurrentNavigation()?.extras?.state?.originUrl;
    }

    ngOnInit() {
        this.getUnitClaim();
        this.password = 'password';
    }

    onClick() {
        if (this.password === 'password') {
          this.password = 'text';
          this.show = true;
        } else {
          this.password = 'password';
          this.show = false;
        }
      }

    getUnitClaim() {
        this.api.getUnitClaim().subscribe(
            (res) => {
                // console.log(res);
                this.environmentData = {
                    ...this.environmentData,
                    ...res["data"],
                };
                this.titleService.setTitle(
                    `${this.environmentData.appName} - ${res["data"]["appCopyrightBy"]}`
                );
                localStorage.setItem("unitInfo", JSON.stringify(res["data"]));
            },
            (err) => {
                // this.isLoading = false;
                // this.displayError = true;
            }
        );
    }

    validate() {
        return this.user.username && this.user.password;
    }

    login() {
        this.isLoading = true;
        this.submitted = true;
        if (this.currentLoginMethod == "email")
            if (this.validate())
                this.api.loginemail(this.user.username, this.user.password).subscribe(
                    (res) => {
                        if (res == null) {
                            this.isLoading = false;
                            return (this.displayError = true);
                        }

                        localStorage.setItem(
                            environment.userInfoLocalStorage,
                            JSON.stringify(res["data"])
                        );
                        localStorage.setItem(
                            "userInfo",
                            JSON.stringify(res["data"])
                        );
                        environment.userInfo = {
                            ...environment.userInfo,
                            ...res["data"],
                        };
                        this.authenticationService.userInfo.next(res["data"]);
                        this.menuService.initMenu();
                        this.isLoading = false;
                        if (this.originUrl) {
                            this.router.navigate([this.originUrl]);
                        } else {
                            this.appService.setUserLoggedIn(true)
                            this.router.navigate(["/admin/"]);
                        }
                    },
                    (err) => {
                        try {
                            this.errorMessage = err.error["message"];
                            if (err.error["status_code"] == 217) {
                                this.urlWp = err.error["data"]["url_wp"];
                                this.isLoading = false;
                                this.displayErrorWP = true;
                            } else {
                                this.isLoading = false;
                                this.displayError = true;
                            }
                        } catch (error) {
                            this.isLoading = false;
                            this.displayError = true;
                            this.errorMessage = this.errorMessage;
                        }
                    }
                );
        if (this.currentLoginMethod == "userid")
            if (this.validate())
                this.api.loginuserid(this.user.username, this.user.password).subscribe(
                    (res) => {
                        if (res == null) {
                            this.isLoading = false;
                            return (this.displayError = true);
                        }

                        localStorage.setItem(
                            environment.userInfoLocalStorage,
                            JSON.stringify(res["data"])
                        );
                        localStorage.setItem(
                            "userInfo",
                            JSON.stringify(res["data"])
                        );
                        environment.userInfo = {
                            ...environment.userInfo,
                            ...res["data"],
                        };
                        this.authenticationService.userInfo.next(res["data"]);
                        this.menuService.initMenu();
                        this.isLoading = false;
                        if (this.originUrl) {
                            this.router.navigate([this.originUrl]);
                        } else {
                            this.appService.setUserLoggedIn(true)
                            this.router.navigate(["/admin/"]);
                        }
                    },
                    (err) => {
                        try {
                            this.errorMessage = err.error["message"];
                            if (err.error["status_code"] == 217) {
                                this.urlWp = err.error["data"]["url_wp"];
                                this.isLoading = false;
                                this.displayErrorWP = true;
                            } else {
                                this.isLoading = false;
                                this.displayError = true;
                            }
                        } catch (error) {
                            this.isLoading = false;
                            this.displayError = true;
                            this.errorMessage = this.errorMessage;
                        }
                    }
                );

        if (this.currentLoginMethod == "phone")
            if (this.validate())
                this.api.loginphone(this.user.username, this.user.password).subscribe(
                    (res) => {
                        if (res == null) {
                            this.isLoading = false;
                            return (this.displayError = true);
                        }

                        localStorage.setItem(
                            environment.userInfoLocalStorage,
                            JSON.stringify(res["data"])
                        );
                        localStorage.setItem(
                            "userInfo",
                            JSON.stringify(res["data"])
                        );
                        environment.userInfo = {
                            ...environment.userInfo,
                            ...res["data"],
                        };
                        this.authenticationService.userInfo.next(res["data"]);
                        this.menuService.initMenu();
                        this.isLoading = false;
                        if (this.originUrl) {
                            this.router.navigate([this.originUrl]);
                        } else {
                            this.appService.setUserLoggedIn(true)
                            this.router.navigate(["/admin/"]);
                        }
                    },
                    (err) => {
                        try {
                            this.errorMessage = err.error["message"];
                            if (err.error["status_code"] == 217) {
                                this.urlWp = err.error["data"]["url_wp"];
                                this.isLoading = false;
                                this.displayErrorWP = true;
                            } else {
                                this.isLoading = false;
                                this.displayError = true;
                            }
                        } catch (error) {
                            this.isLoading = false;
                            this.displayError = true;
                            this.errorMessage = this.errorMessage;
                        }
                    }
                );
    }


    methodsClick(type: string) {
        this.currentLoginMethod = type;
    }

    // onSubmit(originUrl) {
    //     // console.log(this.model)
    //     if(originUrl.valid) {
    //       this.appService.setUserLoggedIn(true)
    //       this.router.navigate(['/admin']);
    //     }
    //   }
}
