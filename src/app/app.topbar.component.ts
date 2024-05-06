import { Component, ElementRef, EventEmitter } from "@angular/core";
import { AppMainComponent } from "./app.main.component";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";
import { fromEvent, of } from "rxjs";
import { debounceTime, map, switchAll, tap } from "rxjs/operators";
import { ApiService } from "./Services/api.service";

@Component({
    selector: "app-topbar",
    template: `
        <div class="topbar clearfix">
            <div class="topbar-left" routerLink="/">
                <div class="logo"></div>
            </div>

            <div class="topbar-right">
                <a
                    id="menu-button"
                    href="#"
                    (click)="app.onMenuButtonClick($event)"
                >
                    <i class="pi pi-angle-left"></i>
                </a>

                <a
                    style="margin-left: 1em"
                    id="rightpanel-menu-button"
                    href="#"
                    (click)="app.onRightPanelButtonClick($event)"
                >
                    <span class="p-overlay-badge">
                        <i style="line-height: 0.8;" class="material-icons">
                            question_answer
                        </i>
                        
                    </span>
                </a>

                <a
                    id="topbar-menu-button"
                    href="#"
                    (click)="app.onTopbarMenuButtonClick($event)"
                >
                    <i class="pi pi-bars"></i>
                </a>

                <ul
                    class="topbar-items animated fadeInDown"
                    [ngClass]="{ 'topbar-items-visible': app.topbarMenuActive }"
                >
                    <li
                        id="step3"
                        #profile
                        class="profile-item"
                        style="margin-top: 2px"
                        *ngIf="app.profileMode === 'top' || app.isHorizontal()"
                        [ngClass]="{
                            'active-top-menu': app.activeTopbarItem === profile
                        }"
                    >
                        <a
                            href="#"
                            (click)="app.onTopbarItemClick($event, profile)"
                        >
                            <ngx-avatar
                                class="profile-image"
                                initialsSize="3"
                                size="34"
                                src="{{ userAvatar }}"
                                name="{{ userName }}"
                            >
                            </ngx-avatar>
                            <span class="topbar-item-name">{{ userName }}</span>
                        </a>

                        <ul class="ultima-menu animated fadeInDown">
                            <li role="menuitem">
                                <a [routerLink]="['user-profile']">
                                    <i class="pi pi-user"></i>
                                    <span>Profil Saya</span>
                                </a>
                            </li>
                            <li role="menuitem">
                                <a href="#" (click)="logout()">
                                    <i class="pi pi-power-off"></i>
                                    <span>Logout</span>
                                </a>
                            </li>
                        </ul>
                    </li>

                    <li
                        *ngIf="app.isMobile()"
                        #search
                        [ngClass]="{
                            'active-top-menu': app.activeTopbarItem === search
                        }"
                    >
                        <a href="#">
                            <i
                                class="topbar-icon material-icons material-icons-outlined"
                                >search</i
                            >
                            <span class="topbar-item-name">Pencarian</span>
                        </a>
                    </li>
                    <li
                        *ngIf="app.isDesktop()"
                        #globalsearchinput
                        class="search-item"
                        [ngClass]="{
                            'active-top-menu':
                                app.activeTopbarItem === globalsearchinput
                        }"
                    >
                        <span class="p-input-icon-left">
                            <i class="topbar-icon pi pi-search"></i>
                            <input
                                id="step1"
                                [(ngModel)]="searchQuery"
                                (click)="
                                    app.onSearchbarItemKeyup(
                                        $event,
                                        globalsearchinput
                                    )
                                "
                                (keyup)="
                                    app.onSearchbarItemKeyup(
                                        $event,
                                        globalsearchinput
                                    )
                                "
                                type="text"
                                pInputText
                                placeholder="Pencarian {{ appName }}"
                            />
                            <p-progressSpinner
                                *ngIf="searchLoadingState"
                                [style]="{
                                    width: '30px',
                                    height: '30px',
                                    position: 'absolute',
                                    right: '10px',
                                    top: '5px'
                                }"
                                styleClass="custom-spinner"
                                strokeWidth="8"
                                fill="#EEEEEE"
                                animationDuration=".5s"
                                >></p-progressSpinner
                            >
                        </span>
                        <ul
                            class="ultima-menu animated fadeInDown app-topbar-search p-pt-3 p-pb-2"
                        >
                            <li
                                *ngFor="
                                    let category of globalSearchResultData;
                                    index as i
                                "
                            >
                                <span
                                    class="app-topbar-search-category p-text-bold"
                                    >{{ category.typename }}</span
                                >
                                <ul *ngIf="category.items">
                                    <li
                                        *ngFor="
                                            let detail of category.items;
                                            index as x
                                        "
                                    >
                                        <a
                                            style="display: inline-flex;
                                        padding-left: 5p;
                                        align-items: center;"
                                            *ngIf="detail.wpid"
                                            (click)="
                                                reloadCurrentRoute(
                                                    '/admin/profile_wp/' +
                                                        detail.wpid,
                                                    detail
                                                )
                                            "
                                        >
                                            <ngx-avatar
                                                initialsSize="2"
                                                size="20"
                                                src="{{ detail.avatar }}"
                                                name="{{ detail.name }}"
                                            >
                                            </ngx-avatar>
                                            <span style="margin-left:5px;">{{
                                                detail.name
                                            }}</span>
                                        </a>
                                        <a
                                            *ngIf="!detail.wpid"
                                            href="javascript:void(0)"
                                        >
                                            {{ detail.name }}
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>

                <div
                    *ngIf="app.isMobile"
                    class="p-ml-4 p-col-12 p-d-md-block p-d-none"
                    style="text-align: center;
                    position: absolute;
                    top: 50%; width: 150px;
                    transform: translateY(-50%); color:#FFF; font-size:9px;"
                >
                    <img
                        style="max-height: 30px;"
                        src="{{ appCopyrightByLogoPath }}"
                        alt="logo {{ appCopyrightBy }}"
                    />
                    <p>{{ appCopyrightBy }}</p>
                </div>
            </div>
        </div>
    `,
})
export class AppTopbarComponent {
    userName: string = "";
    userAvatar: string = "";
    appName: string = "";
    searchQuery: string;
    appCopyrightBy: string;
    appCopyrightByLogoPath: string;
    globalSearchResultData: any[] = [
    ];
    globalInitResult = [
        {
            type: "empty_log",
            typename: "Ketik pencarian anda",
            items: [],
        },
    ];
    searchLoading = new EventEmitter<boolean>();
    searchLoadingState: boolean;
    constructor(
        public app: AppMainComponent,
        private router: Router,
        private el: ElementRef,
        private apiService: ApiService,
    ) {
        this.getUnitInfoStorage();
        ////search debounce
        const obs = fromEvent(this.el.nativeElement, "keyup").pipe(
            map((e: any) => {
                //console.log('mimiti :', e.target.value);
                return e.target.value;
            }),
            // filter((text: string) => text && text.length > 1), //filter out if empty
            debounceTime(700),
            tap(() => this.searchLoading.emit(true)),
            map((query: string) => {
                // console.log("Last map", query);
                return of(query);
            }),
            switchAll()
        );
        /////akhir
        obs.subscribe((result) => this.search());
        // this.notificationsService.getNotifCount();
    }
    ngOnInit() {
        this.userName = localStorage.hasOwnProperty("userInfo")
            ? JSON.parse(localStorage.getItem("userInfo"))["nama_user"]
            : "user_unknown";
        this.userAvatar = localStorage.hasOwnProperty("userInfo")
            ? JSON.parse(localStorage.getItem("userInfo"))["Avatar"]
            : "assets/layout/images/avatar.png";

        this.appName = environment.appName;

        let lastLog = localStorage.getItem("lastSearch");
        if (lastLog) {
            let lastLogData = JSON.parse(lastLog);
            this.globalSearchResultData = lastLogData;
        } else {
            this.globalSearchResultData = this.globalInitResult;
        }
    }

    reloadCurrentRoute(uri: string, data: any) {
        let storeLog = {
            type: "wp",
            typename: "Pencarian terakhir",
            items: [data],
        };
        let lastLog = localStorage.getItem("lastSearch");
        if (lastLog) {
            let lastLogData = JSON.parse(lastLog);
            let index = lastLogData.findIndex((x) => x.type === "wp");

            try {
                // console.log(lastLogData[index]["items"]);
                // console.log(data);
                let exist = lastLogData[index]["items"].findIndex(
                    (x) => x.wpid === data.wpid
                );
                if (exist !== -1) {
                    console.log(exist);
                    // delete lastLogData[index]["items"][exist];
                    lastLogData[index]["items"].splice(exist);
                }
                if (lastLogData[index]["items"].length > 10) {
                    lastLogData[index]["items"].splice(-1);
                }
            } catch (error) {}
            lastLogData[index]["items"].unshift(data);
            localStorage.setItem("lastSearch", JSON.stringify(lastLogData));
        } else {
            localStorage.setItem("lastSearch", JSON.stringify([storeLog]));
        }

        // if (data.wpid) {
        //     this.globalInitResult = [
        //         {
        //             ...this.globalInitResult,
        //             ...storeLog,
        //         },
        //     ];
        // }

        this.router
            .navigateByUrl("/", { skipLocationChange: true })
            .then(() => {
                this.router.navigate([uri]);
            });
    }

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

    search() {
        this.searchLoadingState = true;
        if (this.searchQuery != "") {
            this.apiService.searchAll(this.searchQuery).subscribe((data) => {
                this.globalSearchResultData = [...data["data"]];
                this.searchLoadingState = false;
            });
        } else {
            let lastLog = localStorage.getItem("lastSearch");
            if (lastLog) {
                let lastLogData = JSON.parse(lastLog);
                this.globalSearchResultData = lastLogData;
            } else {
                this.globalSearchResultData = this.globalInitResult;
            }
            this.searchLoadingState = false;
        }
    }

    getUnitInfoStorage() {
        const data_str = localStorage.getItem("unitInfo");
        const data = JSON.parse(data_str);
        // console.log(data);
        this.appCopyrightByLogoPath = data.appCopyrightByLogoPath;
        this.appCopyrightBy = data.appCopyrightBy;
    }
}
