import { Component, OnInit } from "@angular/core";
import { AppMainComponent } from "./app.main.component";

@Component({
    selector: "app-helpdesk-btn",
    template: `
        <div
            class="layout-config"
            style="top: 140px;z-index: 1;"
            [ngClass]="{ 'layout-config-active': app.configActive }"
        >
            <a
                style="cursor: pointer;bottom: 20px;"
                id="layout-config-button2"
                class="layout-config-button"
                target="_blank"
                href="https://wa.me/+6281222730631/?text=Halo, saya {{
                    userName
                }}, saya ingin mengobrol untuk konsultasi tentang aplikasi.&lang=id"
            >
                <span
                    style="font-size: 37px;line-height: inherit;"
                    class="material-icons material-icons-outlined"
                >
                    support_agent
                </span>
            </a>
        </div>
    `,
})
export class AppHelpDeskBtnComponent implements OnInit {
    constructor(public app: AppMainComponent) {}
    userName: string = "";

    ngOnInit() {
        this.userName = localStorage.hasOwnProperty("userInfo")
            ? JSON.parse(localStorage.getItem("userInfo"))["nama_user"]
            : "user_unknown";
    }

    onConfigButtonClick(event) {
        this.app.configActive = !this.app.configActive;
        event.preventDefault();
    }

    onConfigCloseClick(event) {
        this.app.configActive = false;
        event.preventDefault();
    }
}
