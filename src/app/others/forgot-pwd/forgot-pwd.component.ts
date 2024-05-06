import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "../../Services/api.service";
import { environment } from "src/environments/environment";

@Component({
    templateUrl: "./forgot-pwd.component.html",
    styleUrls: ["./forgot-pwd.component.scss"],
    // providers: [MessageService, ConfirmationService],
})
export class ForgotPwdComponent implements OnInit {
    user: any = {};
    touched: boolean = false;
    submitted: boolean = false;
    isLoading: boolean = false;
    displayError: boolean;
    environmentData: any = environment;
    originUrl: string;
    constructor(private api: ApiService, private router: Router) {
        let isUserInfo = localStorage.hasOwnProperty("userInfo");
        if (isUserInfo) {
            localStorage.removeItem("userInfo");
        }
        this.originUrl =
            this.router.getCurrentNavigation()?.extras?.state?.originUrl;
    }

    ngOnInit() {}

    validate() {
        this.touched = true;
        var re =
            /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
        const isValidEmail = re.test(this.user.username);

        return this.user.username && isValidEmail;
    }

    login() {
        if (this.validate()) {
            this.isLoading = true;
            this.submitted = true;
            this.api.forgot(this.user.username).subscribe(
                (res) => {
                    // console.log(res);
                    if (res == null) {
                        this.isLoading = false;
                        this.submitted = false;
                        return (this.displayError = true);
                    }
                    this.isLoading = false;
                    this.submitted = false;
                    this.router.navigateByUrl("/reset-pwd", {
                        state: {
                            key: res["data"]["token"],
                        },
                    });
                    // if (this.originUrl) {
                    //     this.router.navigate([this.originUrl]);
                    // } else {
                    //     this.router.navigate(["/admin"]);
                    // }
                },
                (err) => {
                    this.isLoading = false;
                    this.displayError = true;
                    this.submitted = false;
                }
            );
        }
    }

    back() {
        this.router.navigate(["/login"]).then(() => {
            window.location.reload();
        });
    }
}
