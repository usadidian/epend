import { AppMainComponent } from "./app.main.component";
import { Component } from "@angular/core";
import {
    trigger,
    state,
    transition,
    style,
    animate,
} from "@angular/animations";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { ApiService } from "./Services/api.service";

@Component({
    selector: "app-inline-profile",
    template: `
        <div class="profile" [ngClass]="{ 'profile-expanded': active }">
            <a href="#" (click)="onClick($event)">
                <ngx-avatar
                    class="profile-image"
                    initialsSize="3"
                    src="{{ userAvatar }}"
                    size="60"
                    name="{{ userName }}"
                >
                </ngx-avatar>
                <span class="profile-name">{{ userName }}</span>
                <i class="pi pi-angle-down"></i>
            </a>
        </div>

        <ul
            class="ultima-menu profile-menu"
            [@menu]="active ? 'visible' : 'hidden'"
        >
            <li role="menuitem">
                <a
                    routerLink="user-profile"
                    class="ripplelink"
                    [attr.tabindex]="!active ? '-1' : null"
                >
                    <i class="pi pi-user"></i>
                    <span>Profil Saya</span>
                </a>
            </li>
            <li role="menuitem">
                <a
                    (click)="logout()"
                    class="ripplelink"
                    [attr.tabindex]="!active ? '-1' : null"
                >
                    <i class="pi pi-power-off"></i>
                    <span>Logout</span>
                </a>
            </li>
        </ul>
    `,
    animations: [
        trigger("menu", [
            state(
                "hidden",
                style({
                    height: "0px",
                })
            ),
            state(
                "visible",
                style({
                    height: "*",
                })
            ),
            transition(
                "visible => hidden",
                animate("400ms cubic-bezier(0.86, 0, 0.07, 1)")
            ),
            transition(
                "hidden => visible",
                animate("400ms cubic-bezier(0.86, 0, 0.07, 1)")
            ),
        ]),
    ],
})
export class AppInlineProfileComponent {
    active: boolean;
    userName: string = "";
    userAvatar: string = "";
    constructor(
        public app: AppMainComponent,
        private router: Router,
        private apiService: ApiService
    ) {}

    onClick(event) {
        this.active = !this.active;
        event.preventDefault();
    }

    ngOnInit() {
        this.userName = localStorage.hasOwnProperty("userInfo")
            ? JSON.parse(localStorage.getItem("userInfo"))["nama_user"]
            : "user_unknown";
        this.userAvatar = localStorage.hasOwnProperty("userInfo")
            ? JSON.parse(localStorage.getItem("userInfo"))["Avatar"]
            : "assets/layout/images/avatar.png";
    }

    // logout() {
    //     // console.log(localStorage.hasOwnProperty('userInfo'));
    //     localStorage.removeItem("userInfo");
    //     this.router.navigate(["/login"]);
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
