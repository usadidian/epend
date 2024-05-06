import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { JwtHelperService } from "@auth0/angular-jwt";
import { TreeNode } from "primeng/api";
import { BehaviorSubject, Observable } from "rxjs";
import { shareReplay } from "rxjs/operators";
const CACHE_SIZE = 1;
@Injectable({
    providedIn: "root",
})
export class MenuService {
    httpOptions: any;

    constructor(
        private http: HttpClient,
        private jwtHelper: JwtHelperService
    ) {}

    getToken() {
        var token = localStorage.getItem("userInfo");
        if (token != null) {
            var tkn = JSON.parse(token);
            this.httpOptions = {
                headers: new HttpHeaders({
                    //   'Content-Type': 'application/json',
                    APIKey: `${tkn.APIkey}`,
                }),
            };
        }
    }
    private readonly _datas = new BehaviorSubject<any[]>([]);
    readonly datas$ = this._datas.asObservable();

    get datas(): any[] {
        return this._datas.getValue();
    }

    set datas(val: any[]) {
        this._datas.next(val);
    }

    async addData(data) {
        // console.log(data);
        if (data) {
            const index = this.datas.indexOf(
                this.datas.find((t) => t.WPID === data.id)
            );
            // console.log(index);
            if (index == -1) {
                data["badge"] = "Baru";
                this.datas = [data, ...this.datas];
                // console.log(this.datas);
            }
        }
    }

    private readonly _refresh = new BehaviorSubject<boolean>(false);
    readonly refresh$ = this._refresh.asObservable();
    get refresh(): boolean {
        return this._refresh.getValue();
    }

    set refresh(val: boolean) {
        this._refresh.next(val);
    }
    setRefresh() {
        this.refresh = true;
    }


    updateMenu(id: number, data: any) {
        // console.log(Object.keys(data));
        var formData = new FormData();
        // formData.append("avatar", data.avatar);
        Object.keys(data).forEach((key) => formData.append(key, data[key]));
        // console.log(formData);
        // this.httpOptions["headers"].append(
        //     "Content-Type",
        //     "multipart/form-data"
        // );
        // this.httpOptions["headers"].append("Accept", "application/json");
        return this.http.put(
            `${environment.appBackendUrl}UpdateMenu/${id}`,
            formData,
            this.httpOptions
        );
    }

    addMenu(data: any) {
        this.getToken();
        var formData = new FormData();
        // formData.append("avatar", data.avatar);
        Object.keys(data).forEach((key) => formData.append(key, data[key]));
        this.httpOptions["params"] = new HttpParams();
        return this.http.post(
            `${environment.appBackendUrl}tblMenu`,
            formData,
            this.httpOptions
        );
    }

    addMenuDet(id: number, data: any) {
        this.getToken();
        this.httpOptions["params"] = new HttpParams();
        return this.http.post(
            `${environment.appBackendUrl}AddUrl/${id}`,
            data,
            this.httpOptions
        );
    }

    delMenu(id: number) {
        this.getToken();
        return this.http.delete(
            `${environment.appBackendUrl}tblMenu/${id}`,
            this.httpOptions
        );
    }

    delMenus(data: any) {
        this.getToken();
        // console.log(data);
        this.httpOptions["body"] = data;
        return this.http.delete(
            `${environment.appBackendUrl}DeleteMenus`,
            this.httpOptions
        );
    }

    getViewMenu() {
        this.getToken();
        // this.httpOptions['params'] = new HttpParams().set('page', '1');
        return this.http.get<any>(
            `${environment.appBackendUrl}MsWPDataall2`,
            this.httpOptions
        );
    }

    public stateMenu$: Observable<any>;
    public stateLastApiParams: any;
    getViewMenuLazy(event, reset = false) {
        let apiParams = {};
        if (event) {
            apiParams = {
                page: ((event.first + event.rows) / event.rows).toString(),
                length: event.rows.toString(),
                search: event.globalFilter,
                sort: event.sortField,
                sort_dir: event.sortOrder === -1 ? "desc" : null,
                // search_jenis: event.filters?.search_jenis
                //     ? event.filters["search_jenis"]["value"]["value"]
                //     : null,
            };
            Object.entries(apiParams).forEach((o) =>
                o[1] === null || o[1] === undefined || o[1] === "false"
                    ? delete apiParams[o[0]]
                    : 0
            );
        }
        if (
            !this.stateMenu$ ||
            JSON.stringify(this.stateLastApiParams) !==
                JSON.stringify(apiParams) ||
            reset ||
            this.refresh
        ) {
            this.stateLastApiParams = { ...apiParams };
            this.getToken();

            this.httpOptions["params"] = new HttpParams({
                fromObject: apiParams,
            });
            this.stateMenu$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}tblMenu`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
            this.stateMenu$.subscribe(
                (content) => (this.datas = content["data"])
            );
            this.refresh = false;
        }

        return this.stateMenu$;

        // this.getToken();
        // let apiParams = {
        //   'page': ((event.first+event.rows)/event.rows).toString(),
        //   'length': event.rows.toString(),
        //   'search': event.globalFilter,
        //   'sort': event.sortField,
        //   'sort_dir': event.sortOrder === -1 ? 'desc' : null,
        //   'search_jenis': event.filters['search_jenis'] != undefined ? event.filters['search_jenis']['value'].toString():null,
        //   'nonwp': event.filters['nonwp'] != undefined ? event.filters['nonwp']['value']['checked'].toString():null,
        // };
        // Object.entries(apiParams).forEach( o => (
        //   o[1] === null ||
        //   o[1] === undefined ||
        //   o[1] === 'false'
        //   ? delete apiParams[o[0]] : 0));

        // this.httpOptions['params'] = new HttpParams({ fromObject:apiParams });
        // // return this.http.get<any>(`${environment.appBackendUrl}MsWPData`, this.httpOptions);
        // return this.http.get<any>(`${environment.appBackendUrl}MsWPData`, this.httpOptions);
    }

    getEditMenu1(id) {
        this.getToken();
        return this.http.get<any>(
            `${environment.appBackendUrl}tblMenuall3/${id}`,
            this.httpOptions
        );
    }

    getEditMenu() {
        this.getToken();
        return this.http.get<any>(
            `${environment.appBackendUrl}tblMenuall2`,
            this.httpOptions
        );
    }

    // getJenisUsaha() {
    //     this.getToken();
    //     return this.http.get<any>(
    //         `${environment.appBackendUrl}MsGrupUsahaall2`,
    //         this.httpOptions
    //     );
    // }


    // getKlasifikasi() {
    //     this.getToken();
    //     return this.http.get<any>(
    //         `${environment.appBackendUrl}MsKlasifikasiUsaha`,
    //         this.httpOptions
    //     );
    // }

    // getKhusus() {
    //     this.getToken();
    //     return this.http.get<any>(
    //         `${environment.appBackendUrl}MsLokasiKhususall2`,
    //         this.httpOptions
    //     );
    // }

    // getKota() {
    //     this.getToken();
    //     return this.http.get<any>(
    //         `${environment.appBackendUrl}MsKotaall2`,
    //         this.httpOptions
    //     );
    // }

    // getCities(search) {
    //     this.getToken();
    //     return this.http.get<any>(
    //         `${environment.appBackendUrl}MsKotaall2?search=${search}`,
    //         this.httpOptions
    //     );
    // }

    // getCitiesWp(search) {
    //     this.getToken();
    //     return this.http.get<any>(
    //         `${environment.appBackendUrl}MsKotaall3?search=${search}`,
    //         this.httpOptions
    //     );
    // }

    // getRw(kelurahan_id) {
    //     this.getToken();
    //     return this.http.get<any>(
    //         `${environment.appBackendUrl}MsRWall2/${kelurahan_id}`,
    //         this.httpOptions
    //     );
    // }

    // getPegawai(search: string) {
    //     this.getToken();
    //     return this.http.get<any>(
    //         `${environment.appBackendUrl}MsPegawaiall2?search=${search}`,
    //         this.httpOptions
    //     );
    // }


    // getBiodata() {
    //     this.getToken();
    //     return this.http.get(
    //         `${environment.appBackendUrl}biodata`,
    //         this.httpOptions
    //     );
    // }

    // getLaporan() {
    //     this.getToken();
    //     return this.http.get<TreeNode>(
    //         `${environment.appBackendUrl}RptHead`,
    //         this.httpOptions
    //     );
    // }

    // getUser() {
    //     this.getToken();
    //     return this.http.get<any>(
    //         `${environment.appBackendUrl}tblUser`,
    //         this.httpOptions
    //     );
    // }

    // getGroupUser() {
    //     this.getToken();
    //     return this.http.get<any>(
    //         `${environment.appBackendUrl}tblGroupUser`,
    //         this.httpOptions
    //     );
    // }

    getQuery(query) {
        this.getToken();
        return this.http.get<any>(
            `${environment.appBackendUrl}menu/${query}`,
            this.httpOptions
        );
    }

    // getJns() {
    //     this.getToken();
    //     return this.http.get<any>(
    //         `${environment.appBackendUrl}penonaktifan/jns`,
    //         this.httpOptions
    //     );
    // }

    // getPendDet() {
    //     this.getToken();
    //     return this.http.get<any>(
    //         `${environment.appBackendUrl}menu/penddet`,
    //         this.httpOptions
    //     );
    // }
}
