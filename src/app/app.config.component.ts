import { Component, OnInit } from "@angular/core";
import { AppMainComponent } from "./app.main.component";

@Component({
    selector: "app-config",
    template: `
        <div
            class="layout-config"
            [ngClass]="{ 'layout-config-active': app.configActive }"
            (click)="app.onConfigClick($event)"
        >
            <a
                style="cursor: pointer"
                id="layout-config-button"
                class="layout-config-button"
                (click)="onConfigButtonClick($event)"
            >
                <i class="pi pi-cog"></i>
            </a>
            <a
                style="cursor: pointer"
                class="layout-config-close"
                (click)="onConfigCloseClick($event)"
            >
                <i class="pi pi-times"></i>
            </a>
            <div class="layout-config-content">
                <h5 style="margin-top: 0">Tampilan Input</h5>
                <div class="p-formgroup-inline">
                    <div class="p-field-radiobutton">
                        <p-radioButton
                            name="inputStyle"
                            value="outlined"
                            [(ngModel)]="app.inputStyle"
                            (click)="app.onInputStyle('outlined')"
                            inputId="inputStyle1"
                        ></p-radioButton>
                        <label for="inputStyle1">Outlined</label>
                    </div>
                    <div class="p-field-radiobutton">
                        <p-radioButton
                            name="inputStyle"
                            value="filled"
                            [(ngModel)]="app.inputStyle"
                            (click)="app.onInputStyle('filled')"
                            inputId="inputStyle2"
                        ></p-radioButton>
                        <label for="inputStyle2">Filled</label>
                    </div>
                </div>

                <h5>Efek Ripple</h5>
                <p-inputSwitch
                    [ngModel]="app.ripple"
                    (onChange)="app.onRippleChange($event)"
                ></p-inputSwitch>

                <h5>Tampilan Menu</h5>
                <div class="p-field-radiobutton">
                    <p-radioButton
                        name="menuMode"
                        value="static"
                        [(ngModel)]="app.layoutMode"
                        (click)="app.onLayoutMode('static')"
                        inputId="mode1"
                    ></p-radioButton>
                    <label for="mode1">Vertical</label>
                </div>
                <div class="p-field-radiobutton">
                    <p-radioButton
                        name="menuMode"
                        value="horizontal"
                        [(ngModel)]="app.layoutMode"
                        inputId="mode3"
                        (onClick)="
                            app.onLayoutMode('horizontal');
                            app.profileMode = 'top'
                        "
                    ></p-radioButton>
                    <label for="mode3">Horizontal</label>
                </div>

                <h5>Warna Menu</h5>
                <div class="p-field-radiobutton">
                    <p-radioButton
                        name="darkMenu"
                        [value]="true"
                        [(ngModel)]="app.darkMenu"
                        (click)="app.onDarkMenu('true')"
                        inputId="darkMenu1"
                    ></p-radioButton>
                    <label for="darkMenu1">Gelap</label>
                </div>
                <div class="p-field-radiobutton">
                    <p-radioButton
                        name="darkMenu"
                        [value]="false"
                        [(ngModel)]="app.darkMenu"
                        (click)="app.onDarkMenu('false')"
                        inputId="darkMenu2"
                    ></p-radioButton>
                    <label for="darkMenu2">Terang</label>
                </div>

                <h5>Profil Pengguna</h5>
                <div class="p-field-radiobutton">
                    <p-radioButton
                        name="profileMode"
                        value="inline"
                        [(ngModel)]="app.profileMode"
                        inputId="profileMode1"
                        (click)="app.onProfileMode('inline')"
                        [disabled]="app.isHorizontal()"
                    ></p-radioButton>
                    <label for="profileMode1">Inline</label>
                </div>
                <div class="p-field-radiobutton">
                    <p-radioButton
                        name="profileMode"
                        value="top"
                        [(ngModel)]="app.profileMode"
                        inputId="profileMode2"
                        (click)="app.onProfileMode('top')"
                        [disabled]="app.isHorizontal()"
                    ></p-radioButton>
                    <label for="profileMode2">Overlay</label>
                </div>

                <h5>Mode Tema</h5>
                <div class="p-field-radiobutton">
                    <p-radioButton
                        name="compactMode"
                        [value]="true"
                        [(ngModel)]="app.compactMode"
                        inputId="compactMode1"
                        (onClick)="
                            app.onCompactMode('true');
                            changeThemeStyle($event, true)
                        "
                    ></p-radioButton>
                    <label for="compactMode1">Ringkas</label>
                </div>
                <div class="p-field-radiobutton">
                    <p-radioButton
                        name="compactMode"
                        [value]="false"
                        [(ngModel)]="app.compactMode"
                        inputId="compactMode2"
                        (onClick)="
                            app.onCompactMode('false');
                            changeThemeStyle($event, false)
                        "
                    ></p-radioButton>
                    <label for="compactMode2">Standar</label>
                </div>

                <h5>Ganti Tema</h5>
                <div class="layout-themes">
                    <div *ngFor="let theme of themes">
                        <a
                            style="cursor: pointer"
                            (click)="changeTheme(theme.label)"
                        >
                            <img
                                src="assets/layout/images/configurator/theme/{{
                                    theme.image
                                }}.svg"
                                alt="ultima"
                            />
                            <i
                                class="pi pi-check"
                                *ngIf="themeColor === theme.label"
                            ></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `,
})
export class AppConfigComponent implements OnInit {
    themes: any[];

    themeColor = localStorage.hasOwnProperty("userTheme_themeColor")
        ? localStorage.getItem("userTheme_themeColor")
        : "indigo";

    constructor(public app: AppMainComponent) {}

    ngOnInit() {
        this.themes = [
            { image: "indigo-pink", label: "indigo" },
            // { image: "dark", label: "dark" },
            { image: "brown-green", label: "brown" },
            { image: "blue-amber", label: "blue" },
            { image: "bluegrey-green", label: "blue-grey" },
            { image: "dark-blue", label: "dark-blue" },
            { image: "dark-green", label: "dark-green" },
            { image: "green-yellow", label: "green" },
            { image: "purple-cyan", label: "purple-cyan" },
            { image: "purple-amber", label: "purple-amber" },
            { image: "teal-lime", label: "teal" },
            { image: "cyan-amber", label: "cyan" },
            { image: "grey-deeporange", label: "grey" },
        ];
    }

    changeTheme(theme) {
        this.themeColor = theme;
        localStorage.setItem("userTheme_themeColor", theme);
        if (this.app.compactMode) {
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

    changeThemeStyle(event, compactMode) {
        if (compactMode) {
            this.changeStyleSheetsColor(
                "theme-css",
                "theme-" + this.themeColor + "-compact.css"
            );
        } else {
            this.changeStyleSheetsColor(
                "theme-css",
                "theme-" + this.themeColor + ".css"
            );
        }
        localStorage.setItem("userTheme_themeColor", this.themeColor);
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
