import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../Services/api.service";
import { environment } from "src/environments/environment";

@Component({
    templateUrl: "./reset-pwd.component.html",
    styleUrls: ["./reset-pwd.component.scss"],
    // providers: [MessageService, ConfirmationService],
})
export class ResetPwdComponent implements OnInit {
    user: any = {};
    touched: boolean = false;
    submitted: boolean = false;
    isLoading: boolean = false;
    reloadState: boolean = false;
    otpValid: boolean = false;
    displayError: boolean;
    displayError2: boolean;
    displaySuccess: boolean;
    environmentData: any = environment;
    key: string;
    key2: string;
    id: string;
    changePasswordState: boolean = false;
    newPwd: string;
    newPwd2: string;
    newPwdValid: boolean = false;
    strengthBadge: any = {
        textTitle: "",
        textContent: "",
        backgroundColor: "",
    };

    constructor(private api: ApiService, private router: Router) {
        let isUserInfo = localStorage.hasOwnProperty("userInfo");
        if (isUserInfo) {
            localStorage.removeItem("userInfo");
        }
        this.key = this.router.getCurrentNavigation()?.extras?.state?.key;
    }

    ngOnInit() {
        // console.log(this.key);
        if (!this.key) {
            this.reloadState = true;
        }
    }

    validate() {
        this.touched = true;

        return this.user.username && this.user?.username.length === 6;
    }

    login() {
        if (this.validate()) {
            this.isLoading = true;
            this.submitted = true;
            this.api
                .forgot_validate_otp(this.user.username, this.key)
                .subscribe(
                    (res) => {
                        // console.log(res);
                        if (res == null) {
                            this.isLoading = false;
                            this.submitted = false;
                            return (this.displayError = true);
                        }
                        this.key = null;
                        this.key2 = res["data"]["token"];
                        this.id = res["data"]["id"];
                        this.otpValid = true;
                        this.isLoading = false;
                        this.submitted = false;

                        // this.router.navigateByUrl("/reset-pwd", {
                        //     state: {
                        //         originUrl: this.router.routerState.snapshot.url,
                        //     },
                        // });
                    },
                    (err) => {
                        this.isLoading = false;
                        this.displayError = true;
                        this.submitted = false;
                    }
                );
        }
    }

    validate2() {
        this.touched = true;
        return (
            this.newPwd === this.newPwd2 &&
            this.newPwd &&
            this.newPwd2 &&
            this.newPwd.length > 5 &&
            this.newPwd2.length > 5
        );
    }

    changePwd() {
        if (this.validate2()) {
            this.isLoading = true;
            this.submitted = true;
            this.api.reset_pwd(this.newPwd, this.key2, this.id).subscribe(
                (res) => {
                    // console.log(res);
                    if (res == null) {
                        this.isLoading = false;
                        this.submitted = false;
                        return (this.displayError2 = true);
                    }

                    this.submitted = false;
                    this.isLoading = false;
                    this.displaySuccess = true;
                    setTimeout(() => {
                        this.router.navigateByUrl("/login");
                    }, 700);
                },
                (err) => {
                    this.isLoading = false;
                    this.displayError2 = true;
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

    chekPwdStrength() {
        // let timeout;
        let strongPassword = new RegExp(
            "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,})"
        );
        let mediumPassword = new RegExp(
            "((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{6,}))"
        );

        if (strongPassword.test(this.newPwd)) {
            this.strengthBadge.backgroundColor = "green";
            this.strengthBadge.textTitle = "Strong";
            this.strengthBadge.textContent = "OK. Kata sandi Kuat";
        } else if (mediumPassword.test(this.newPwd)) {
            this.strengthBadge.backgroundColor = "blue";
            this.strengthBadge.textTitle = "Medium";
            this.strengthBadge.textContent =
                "Kekuatan kata sandi Sedang. Belum berisi: minimal 6 karakter atau digit 0-9 atau spesial karakter atau huruf besar dan kecil";
        } else {
            this.strengthBadge.backgroundColor = "red";
            this.strengthBadge.textTitle = "Weak";
            this.strengthBadge.textContent =
                "Kata sandi Lemah. Belum berisi: minimal 6 karakter atau digit 0-9 atau spesial karakter atau huruf besar dan kecil";
        }
    }
}
