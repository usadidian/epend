import { Component } from "@angular/core";
import { AppMainComponent } from "./app.main.component";
import * as moment from "moment";

@Component({
    selector: "app-rightpanel",
    template: `
        <div
            class="layout-rightpanel"
            [ngClass]="{ 'layout-rightpanel-active': app.rightPanelActive }"
            (click)="app.onRightPanelClick()"
        >
            <div class="layout-rightpanel-wrapper">
                <div
                    style="padding: 8px;margin-bottom: 100px;"
                    class="layout-rightpanel-content"
                >
                    <div
                        class=" p-grid p-ai-center p-jc-center
                vertical-container"
                    >
                        <div class="p-col-10">
                            <h1>Obrolan</h1>
                            <h2></h2>
                        </div>
                        <div class="p-col-2">
                            <p-progressSpinner
                                *ngIf="app.lodingUsers"
                                [style]="{ width: '20px', height: '20px' }"
                                styleClass="custom-spinner"
                                strokeWidth="8"
                                fill="#EEEEEE"
                                animationDuration=".5s"
                            ></p-progressSpinner>
                        </div>
                    </div>

                    <ul class="weekly-weather">
                        <li
                            *ngFor="
                                let group of app.usersOnlineGroup;
                                let in = index
                            "
                            style="border: none;cursor:default; margin-top: 15px;"
                        >
                            <div
                                style="background: #EFEFF8;"
                                class=" p-py-0 p-grid p-ai-center vertical-container"
                            >
                                <div class="p-col-2  p-py-0">
                                    <span
                                        style="color:gray"
                                        class="material-icons material-icons-outlined"
                                    >
                                        groups
                                    </span>
                                </div>
                                <div class="p-col-10  p-py-0">
                                    <p
                                        style="font-size: 11px;font-weight: 500;color: #666;margin-bottom: 0px;"
                                    >
                                        {{ group.group }}
                                    </p>
                                </div>
                            </div>
                            <ul style="margin-top:0" class="weekly-weather">
                                <li
                                    *ngFor="
                                        let user of group.data;
                                        let i = index
                                    "
                                    [attr.data-index]="i"
                                    [style]="
                                        group.group !== 'WP' &&
                                        group.group !== 'Executive Epad'
                                            ? 'cursor:pointer;'
                                            : 'cursor:default;'
                                    "
                                    (click)="
                                        group.group !== 'WP' &&
                                        group.group !== 'Executive Epad'
                                            ? app.chat(user)
                                            : null
                                    "
                                >
                                    <div
                                        class=" p-grid p-ai-center
                            vertical-container"
                                    >
                                        <div class="p-col-2">
                                            <span
                                                class="p-overlay-badge p-mr-5"
                                            >
                                                <span
                                                    *ngIf="user.onlineState"
                                                    class="p-badge p-badge-success"
                                                ></span>
                                                <ngx-avatar
                                                    src="{{ user.avatar }}"
                                                    initialsSize="2"
                                                    size="24"
                                                    name="{{ user.name }}"
                                                >
                                                </ngx-avatar>
                                            </span>
                                        </div>
                                        <div
                                            [class]="
                                                user.unreadCount > 0
                                                    ? 'p-col-8 p-pt-4'
                                                    : 'p-col-10 p-pt-4'
                                            "
                                        >
                                            <div
                                                class="p-grid p-ai-center vertical-container"
                                            >
                                                <div class="p-col-12 p-py-0">
                                                    <span
                                                        class="p-text-nowrap p-text-truncate"
                                                        >{{
                                                            user.name.split(
                                                                "-"
                                                            )[0]
                                                        }}</span
                                                    >
                                                </div>
                                                <div class="p-col-12 p-py-0">
                                                    <span
                                                        *ngIf="user.onlineState"
                                                        style="font-size:9px"
                                                        class="p-text-nowrap p-text-truncate"
                                                        >Sedang aktif</span
                                                    >
                                                    <span
                                                        *ngIf="
                                                            !user.onlineState
                                                        "
                                                        style="font-size:9px"
                                                        class="p-text-nowrap p-text-truncate"
                                                        >Aktif
                                                        {{
                                                            user.lastView
                                                                | momentFormat
                                                                    : "YYYY-MM-DD HH:mm:ss"
                                                        }}</span
                                                    >
                                                </div>
                                                <div
                                                    *ngIf="user.lastMessage"
                                                    class="p-col-12 p-py-0 p-text-nowrap p-text-truncate"
                                                >
                                                    <span
                                                        style="font-size:9px"
                                                        class=""
                                                        ><span
                                                            style=" font-size: inherit;color: gray;"
                                                            class="material-icons material-icons-outlined"
                                                        >
                                                            chat
                                                        </span>
                                                        {{
                                                            user.lastMessage
                                                        }}</span
                                                    >
                                                </div>
                                            </div>
                                            <div
                                                class="p-grid p-ai-center vertical-container"
                                            ></div>
                                        </div>
                                        <div
                                            *ngIf="user.unreadCount > 0"
                                            class="p-col-2 p-mt-1 "
                                        >
                                            <span
                                                class="p-badge p-badge-danger"
                                                >{{ user.unreadCount }}</span
                                            >
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    `,
})
export class AppRightpanelComponent {
    constructor(public app: AppMainComponent) {
        // let now = moment().lang("id"); // add this 2 of 4
        // console.log("hello world", now.format()); // add this 3 of 4
        // console.log(now.add(7, "days").fromNow()); // add this 4of 4
    }
}
