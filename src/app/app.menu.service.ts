import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { JwtHelperService } from "@auth0/angular-jwt";
@Injectable()
export class MenuService {
    constructor(private jwtHelper: JwtHelperService) {
        // this.initMenu();
    }

    private menuSource = new Subject<string>();
    private resetSource = new Subject();

    menuSource$ = this.menuSource.asObservable();
    resetSource$ = this.resetSource.asObservable();

    onMenuStateChange(key: string) {
        this.menuSource.next(key);
    }

    reset() {
        this.resetSource.next();
    }

    private readonly _datas = new BehaviorSubject<any[]>([]);
    readonly datas$ = this._datas.asObservable();

    get datas(): any[] {
        return this._datas.getValue();
    }

    set datas(val: any[]) {
        this._datas.next(val);
    }

    initMenu() {
        const store = localStorage.getItem("userInfo");
        const token = JSON.parse(store)["APIkey"];
        const value = this.jwtHelper.decodeToken(token);
        this.datas = [
            {
                label: "Beranda",
                icon: "home",
                visible: true,
                routerLink: ["/admin"],
            },
            {
                label: "Utama",
                icon: "table_view",
                separator: true,
                title: "Utama",
                expanded: true,
                visible: true,
                items: [
                    
                    {
                        label: "Potensi Pendapatan",
                        icon: "queue_play_next",
                        visible: value.IsAdmin || value.IsPendataan,
                        routerLink: ["/admin/daftarpotensi"],
                    },

                ],
            },


            /////////SETUP
            // {
            //     label: "Manajemen Akun",
            //     icon: "admin_panel_settings",
            //     title: "User Aplikasi",
            //     visible: value.IsAdmin,
            //     separator: true,
            //     expanded: true,
            //     items: [
            //         {
            //             label: "Pengguna",
            //             icon: "manage_accounts",
            //             visible: value.IsAdmin,
            //             routerLink: ["users"],
            //         },
            //         {
            //             label: "Grup",
            //             icon: "groups",
            //             visible: value.IsAdmin,
            //             routerLink: ["groups"],
            //         },
            //     ],
            // },

        ]
            // .filter((p) => p.visible === true || p.visible === 1)
            // .map((p) => ({
            //     ...p,
            //     items: p.items?.filter((s) => s.visible),
            // }));
        // console.log(this.datas);
    }
}
