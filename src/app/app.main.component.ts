import { Component, HostListener, OnInit } from "@angular/core";
import { MenuService } from "./app.menu.service";
import { MenuItem, PrimeNGConfig } from "primeng/api";
import { MessageService } from "primeng/api";
import { AsyncPipe, formatDate } from "@angular/common";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs/operators";
import { UsersService } from "./Services/users.service";

@Component({
    selector: "app-main",
    templateUrl: "./app.main.component.html",
    providers: [
        MessageService,
        AsyncPipe,
    ],
})
export class AppMainComponent implements OnInit {
    message: any;

    layoutMode = "static";

    darkMenu = false;

    profileMode = "overlay";

    rotateMenuButton: boolean;

    topbarMenuActive: boolean;

    overlayMenuActive: boolean;

    staticMenuDesktopInactive: boolean;

    staticMenuMobileActive: boolean;

    rightPanelActive: boolean;

    rightPanelClick: boolean;

    menuClick: boolean;

    topbarItemClick: boolean;

    activeTopbarItem: any;

    menuHoverActive: boolean;

    configActive: boolean;

    configClick: boolean;

    inputStyle = "outlined";

    ripple = true;

    compactMode = false;

    bottomNavBaritems: MenuItem[] = [
        {
            label: "",
            icon: "home",
            routerLink: ["/admin"],
            routerLinkActiveOptions: "{exact: true}",
            command: (event) => this.removeBottomBarActive(),
        },
        
        {
            label: "",
            icon: "analytics",
            routerLink: ["/admin/invoices3/dataanalitik"],
            routerLinkActiveOptions: "{exact: true}",
            command: (event) => this.removeBottomBarActive(),
        },
        {
            label: "",
            icon: "analytics",
            routerLink: ["/admin/invoices3/dataanalitik2"],
            routerLinkActiveOptions: "{exact: true}",
            command: (event) => this.removeBottomBarActive(),
        },
        {
            label: "",
            icon: "add_chart",
            routerLink: ["/admin/invoices/potensi_penerimaan"],
            routerLinkActiveOptions: "{exact: true}",
            command: (event) => this.removeBottomBarActive(),
        },
        {
            label: "",
            icon: "area_chart",
            routerLink: ["/admin/invoices/potensi_wilayah"],
            routerLinkActiveOptions: "{exact: true}",
            command: (event) => this.removeBottomBarActive(),
        },
        
    ];

    countNotif: number = 0;

    bottomNavBaractiveItem: MenuItem;

    usersOnline: any[];
    usersOnlineGroup: any[];
    lodingUsers: boolean = false;
    chatBoxActive: boolean = false;
    chatCurrentData: any;

    constructor(
        private menuService: MenuService,
        private primengConfig: PrimeNGConfig,
        public messageService: MessageService,
        public userService: UsersService,
        public router: Router
    ) {
        
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe((params) => {
                // console.log(this.router);
                let bottomNavBaractiveindex = this.bottomNavBaritems.findIndex(
                    (x) =>
                        x.routerLink[0] ===
                        this.router.url
                            .replace("/await", "")
                            .replace("/valid", "")
                );
                this.bottomNavBaractiveItem =
                    this.bottomNavBaritems[bottomNavBaractiveindex];

                const el2 =
                    document.querySelector<HTMLElement>(".p-tabmenu-ink-bar");
                el2.style.backgroundColor = "transparent";
            });

        // reset storage after new features
        // console.log(!localStorage.hasOwnProperty("ePendapatan_feature_one"));
        if (!localStorage.hasOwnProperty("ePendapatan_feature_one")) {
            localStorage.removeItem("userTheme_ripple");
            localStorage.removeItem("userTheme_inputStyle");
            localStorage.removeItem("userTheme_layoutMode");
            localStorage.removeItem("userTheme_darkMenu");
            localStorage.removeItem("userTheme_profileMode");
            localStorage.removeItem("userTheme_compactMode");
            localStorage.removeItem("userTheme_themeColor");
        }
    }

    @HostListener("window:focus", ["$event"])
    onFocus(event: any): void {
        if (this.userService.chatBoxActive) {
            this.userService
                .fetchChatMessageCurrent(this.chatCurrentData.email)
                .then((x) => {});
        } 
        // location.reload();
    }

    ngOnInit() {
        // this.notificationsService.notifCount$.subscribe((data) => {
        //     this.countNotif = 5;
        // });

        this.primengConfig.ripple = localStorage.hasOwnProperty(
            "userTheme_ripple"
        )
            ? localStorage.getItem("userTheme_ripple") === "true"
            : true;
        this.inputStyle = localStorage.hasOwnProperty("userTheme_inputStyle")
            ? localStorage.getItem("userTheme_inputStyle")
            : "outlined";
        this.ripple = localStorage.hasOwnProperty("userTheme_ripple")
            ? localStorage.getItem("userTheme_ripple") === "true"
            : true;
        this.layoutMode = localStorage.hasOwnProperty("userTheme_layoutMode")
            ? localStorage.getItem("userTheme_layoutMode")
            : "static";
        this.darkMenu = localStorage.hasOwnProperty("userTheme_darkMenu")
            ? localStorage.getItem("userTheme_darkMenu") === "true"
            : false;
        this.profileMode = localStorage.hasOwnProperty("userTheme_profileMode")
            ? localStorage.getItem("userTheme_profileMode")
            : "top";
        this.compactMode = localStorage.hasOwnProperty("userTheme_compactMode")
            ? localStorage.getItem("userTheme_compactMode") === "true"
            : false;
        if (localStorage.hasOwnProperty("userTheme_themeColor")) {
            this.changeTheme(localStorage.getItem("userTheme_themeColor"));
        }
        // let bottomNavBaractiveindex = this.bottomNavBaritems.findIndex(
        //     (x) => x.routerLink[0] === window.location.hash.replace("#", "")
        // );
        // this.bottomNavBaractiveItem =
        //     this.bottomNavBaritems[bottomNavBaractiveindex];
    }

    removeBottomBarActive() {
        const el = document.querySelector(
            "body > app-root > app-main > div > div > p-tabmenu > div > ul > li.p-tabmenuitem.p-highlight"
        );
        if (el) {
            el.classList.remove("p-highlight");
        }
    }

    changeTheme(theme) {
        if (this.compactMode) {
            this.changeStyleSheetsColor(
                "theme-css",
                "theme-" + theme + "-compact.css"
            );
        } else {
            this.changeStyleSheetsColor("theme-css", "theme-" + theme + ".css");
        }
        this.changeStyleSheetsColor("layout-css", "layout-" + theme + ".css");
    }

    changeStyleSheetsColor(id, value) {
        const element = document.getElementById(id);
        const urlTokens = element.getAttribute("href").split("/");
        urlTokens[urlTokens.length - 1] = value;

        const newURL = urlTokens.join("/");

        this.replaceLink(element, newURL);
    }

    isIE() {
        return /(MSIE|Trident\/|Edge\/)/i.test(window.navigator.userAgent);
    }

    replaceLink(linkElement, href) {
        if (this.isIE()) {
            linkElement.setAttribute("href", href);
        } else {
            const id = linkElement.getAttribute("id");
            const cloneLinkElement = linkElement.cloneNode(true);

            cloneLinkElement.setAttribute("href", href);
            cloneLinkElement.setAttribute("id", id + "-clone");

            linkElement.parentNode.insertBefore(
                cloneLinkElement,
                linkElement.nextSibling
            );

            cloneLinkElement.addEventListener("load", () => {
                linkElement.remove();
                cloneLinkElement.setAttribute("id", id);
            });
        }
    }

    onInputStyle(val: string) {
        localStorage.setItem("userTheme_inputStyle", val);
    }

    onLayoutMode(value: string) {
        return localStorage.setItem("userTheme_layoutMode", value);
    }

    onDarkMenu(value: string) {
        return localStorage.setItem("userTheme_darkMenu", value);
    }

    onProfileMode(value: string) {
        return localStorage.setItem("userTheme_profileMode", value);
    }

    onCompactMode(value: string) {
        return localStorage.setItem("userTheme_compactMode", value);
    }

    onLayoutClick() {
        if (!this.topbarItemClick) {
            this.activeTopbarItem = null;
            this.topbarMenuActive = false;
        }

        if (!this.menuClick) {
            if (this.isHorizontal() || this.isSlim()) {
                this.menuService.reset();
            }

            if (this.overlayMenuActive || this.staticMenuMobileActive) {
                this.hideOverlayMenu();
            }

            this.menuHoverActive = false;
        }

        if (!this.rightPanelClick) {
            this.rightPanelActive = false;
        }

        if (this.configActive && !this.configClick) {
            this.configActive = false;
        }

        this.configClick = false;
        this.topbarItemClick = false;
        this.menuClick = false;
        this.rightPanelClick = false;
    }

    onMenuButtonClick(event) {
        this.menuClick = true;
        this.rotateMenuButton = !this.rotateMenuButton;
        this.topbarMenuActive = false;

        if (this.layoutMode === "overlay") {
            this.overlayMenuActive = !this.overlayMenuActive;
        } else {
            if (this.isDesktop()) {
                this.staticMenuDesktopInactive =
                    !this.staticMenuDesktopInactive;
            } else {
                this.staticMenuMobileActive = !this.staticMenuMobileActive;
            }
        }

        event.preventDefault();
    }

    onMenuClick($event) {
        this.menuClick = true;
    }

    onTopbarMenuButtonClick(event) {
        this.topbarItemClick = true;
        this.topbarMenuActive = !this.topbarMenuActive;

        this.hideOverlayMenu();

        event.preventDefault();
    }

    onTopbarItemClick(event, item) {
        this.topbarItemClick = true;

        if (this.activeTopbarItem === item) {
            this.activeTopbarItem = null;
        } else {
            this.activeTopbarItem = item;
        }

        event.preventDefault();
    }

    chat(data) {
        // console.log(data);
        // if (this.chatCurrentData?.email !== data.email) {
        // this.userService.fetchChatMessageCurrent(data.email);
        // }

        this.chatBoxActive = true;
        this.chatCurrentData = data;
        this.userService.setChatMessageCurrentUser(data);
        this.userService.toggleChatBox();
    }

    onSearchbarItemKeyup(event, item) {
        this.topbarItemClick = true;

        this.activeTopbarItem = item;

        event.preventDefault();
    }

    onTopbarSubItemClick(event) {
        event.preventDefault();
    }

    onRightPanelButtonClick(event) {
        this.lodingUsers = true;
        if (!this.rightPanelActive) {
            this.userService.fetchUsersOnline(true).then((data) => {
                this.userService.usersOnline$.subscribe((x) => {
                    this.usersOnline = x;
                    this.lodingUsers = false;
                    let datax = new Set(x.map((item) => item.group));
                    let result = [];
                    datax.forEach((group) => {
                        result.push({
                            group: group,
                            data: x.filter((i) => i.group === group),
                        });
                    });
                    this.usersOnlineGroup = result;
                    // console.log(result);
                });
            });
        }

        this.rightPanelClick = true;
        this.rightPanelActive = !this.rightPanelActive;
        event.preventDefault();

        // this.userService.usersOnline$.subscribe((datas) => {
        //     console.log(datas);
        //     if (datas.length === 0) {
        //         this.userService.fetchUsersOnline(true).then((data) => {
        //             // console.log(data);
        //             this.usersOnline = [data];
        //             this.lodingUsers = false;
        //         });
        //     } else {
        //         this.usersOnline = [datas];
        //         this.lodingUsers = false;
        //     }
        // });
    }

    onRightPanelClick() {
        this.rightPanelClick = true;
    }

    onRippleChange(event) {
        this.ripple = event.checked;
        localStorage.setItem("userTheme_ripple", event.checked);
    }

    onConfigClick(event) {
        this.configClick = true;
    }

    hideOverlayMenu() {
        this.rotateMenuButton = false;
        this.overlayMenuActive = false;
        this.staticMenuMobileActive = false;
    }

    isTablet() {
        const width = window.innerWidth;
        return width <= 1024 && width > 640;
    }

    isDesktop() {
        return window.innerWidth > 1024;
    }

    isMobile() {
        return window.innerWidth <= 640;
    }

    isOverlay() {
        return this.layoutMode === "overlay";
    }

    isStatic() {
        return this.layoutMode === "static";
    }

    isHorizontal() {
        return this.layoutMode === "horizontal";
    }

    isSlim() {
        return this.layoutMode === "slim";
    }
}
