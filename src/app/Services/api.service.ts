import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { JwtHelperService } from "@auth0/angular-jwt";
import { BehaviorSubject, Observable } from "rxjs";
import { shareReplay } from "rxjs/operators";
import { IfStmt } from "@angular/compiler";
// import { LoginComponent } from "src/app/login/login.component";

const CACHE_SIZE = 1;
@Injectable({
    providedIn: "root",
})
export class ApiService {
    httpOptions: any;
    stateLastApiParams: any;
    // stateRealisasiCharts$: any;
    refresh: boolean;
    // currentLoginMethod: string = "email" && "userid" && "phone";

    constructor(
        // private loginmethode: LoginComponent,
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

    public isAuthenticated(): boolean {
        try {
            const store = localStorage.getItem("userInfo");
            const token = JSON.parse(store)["APIkey"];
            const decodedToken = this.jwtHelper.decodeToken(token);
            // const expirationDate = this.jwtHelper.getTokenExpirationDate(token);
            // const isExpired = this.jwtHelper.isTokenExpired(token);
            // console.log(decodedToken.code_group);
            return !this.jwtHelper.isTokenExpired(token);
        } catch (error) {
            return false;
        }
    }

    public isAdmin(): boolean {
        try {
            const store = localStorage.getItem("userInfo");
            const token = JSON.parse(store)["APIkey"];
            const decodedToken = this.jwtHelper.decodeToken(token);
            // console.log(decodedToken);
            return decodedToken.code_group === "ADM";
        } catch (error) {
            return false;
        }
    }

    public isExecutive(): boolean {
        try {
            const store = localStorage.getItem("userInfo");
            const token = JSON.parse(store)["APIkey"];
            const decodedToken = this.jwtHelper.decodeToken(token);
            // console.log(decodedToken);
            return decodedToken.code_group === "ADM";
        } catch (error) {
            return false;
        }
    }

    public isAdminPendataan(): boolean {
        try {
            const store = localStorage.getItem("userInfo");
            const token = JSON.parse(store)["APIkey"];
            const decodedToken = this.jwtHelper.decodeToken(token);
            return (
                decodedToken.code_group === "ADM" ||
                decodedToken.code_group === "SPS1"||
                decodedToken.code_group === "PDT" 
            );
        } catch (error) {
            return false;
        }
    }

    public isPublic(): boolean {
        try {
            const store = localStorage.getItem("userInfo");
            const token = JSON.parse(store)["APIkey"];
            const decodedToken = this.jwtHelper.decodeToken(token);
            // console.log(decodedToken);
            return decodedToken.code_group === "ADM";
        } catch (error) {
            return false;
        }
    }

    getUnitClaim() {
        this.getToken();
        return this.http.post(
            `${environment.appBackendUrl}unit_claim`,
            this.httpOptions
        );
    }

    login(username, password) {
        return this.http.post(`${environment.appBackendUrl}login`, {
            email :username,
            password: password,
        });
    }


    loginemail(username, password) {
        return this.http.post(`${environment.appBackendUrl}login`, {
            email :username,
            password: password,
        });

    }

    loginuserid(username, password) {
        return this.http.post(`${environment.appBackendUrl}login`, {
            userid :username,
            password: password,
        });
    }

    loginphone(username, password) {
        return this.http.post(`${environment.appBackendUrl}login`, {
            phone :username,
            password: password,
        });
    }

    updateDevice(deviceId: string) {
        this.getToken();
        return this.http.post(
            `${environment.appBackendUrl}devupdate`,
            { device: deviceId },
            this.httpOptions
        );
    }

    forgot(username) {
        return this.http.post(`${environment.appBackendUrl}forgot-pwd`, {
            email: username,
        });
    }

    forgot_validate_otp(otp, token) {
        return this.http.post(`${environment.appBackendUrl}forgot-auth-otp`, {
            otp: Number(otp),
            token: token,
        });
    }

    reset_pwd(pwd, apikey, id) {
        this.httpOptions = {
            headers: new HttpHeaders({
                token: apikey,
            }),
        };
        return this.http.post(
            `${environment.appBackendUrl}reset-pwd`,
            {
                new_pwd: pwd,
                id: id,
            },
            this.httpOptions
        );
    }

    logout() {
        this.getToken();
        return this.http.post(
            `${environment.appBackendUrl}logout`,
            {},
            this.httpOptions
        );
    }

    searchAll(query: string) {
        // console.log(query);
        this.getToken();
        return this.http.get(
            `${environment.appBackendUrl}search?query=${query}`,
            this.httpOptions
        );
    }

    getProfileWp(npwpd: string) {
        // console.log(npwpd);
        this.getToken();
        return this.http.get(
            `${environment.appBackendUrl}profile_wp/${npwpd}`,
            this.httpOptions
        );
    }

    public stateHomeChart1$: Observable<any>;
    private readonly _refreshHomeChart1 = new BehaviorSubject<boolean>(false);
    readonly refreshHomeChart1$ = this._refreshHomeChart1.asObservable();
    get refreshHomeChart1(): boolean {
        return this._refreshHomeChart1.getValue();
    }

    set refreshHomeChart1(val: boolean) {
        this._refreshHomeChart1.next(val);
    }
    setRefreshHomeChart1() {
        this.refreshHomeChart1 = true;
        this.getHomeCharts1();
    }

    getHomeCharts1(refresh = false) {
        // console.log(this.stateHomeChart1$);
        if (!this.stateHomeChart1$ || refresh || this.refreshHomeChart1) {
            this.getToken();
            this.stateHomeChart1$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}DataAkhir`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }
        return this.stateHomeChart1$;
    }

    public stateChart$: Observable<any>;
    public stateChart2$: Observable<any>;
    public stateChart3$: Observable<any>;
    public stateChart4$: Observable<any>;
    private readonly _refreshChart = new BehaviorSubject<boolean>(false);
    readonly refresChart$ = this._refreshHomeChart1.asObservable();
    get refreshChart(): boolean {
        return this._refreshChart.getValue();
    }

    set refreshChart(val: boolean) {
        this._refreshHomeChart1.next(val);
    }
    setRefreshChart() {
        this.refreshChart = true;
    }

    // getRealisasiCharts(refresh = false) {
    //     if (!this.stateChart$ || refresh || this.refreshChart) {
    //         this.getToken();
    //         this.stateChart$ = this.http
    //             .get<any>(
    //                 `${environment.appBackendUrl}realTahun`,
    //                 this.httpOptions
    //             )
    //             .pipe(shareReplay(CACHE_SIZE));
    //     }
    //     return this.stateChart$;
    // }
    // public stateRealisasiCharts$: Observable<any>;
    // getRealisasiCharts(reset: boolean = false, params: any = {}) {
    //     if (!this.stateRealisasiCharts$ || reset) {
    //         this.getToken();
    //         this.httpOptions["params"] = new HttpParams({
    //             fromObject: params,
    //         });
    //         this.stateRealisasiCharts$ = this.http
    //             .get<any>(
    //                 `${environment.appBackendUrl}realTahun`,
    //                 this.httpOptions
    //             )
    //             .pipe(shareReplay(CACHE_SIZE));
    //     }
    //     return this.stateRealisasiCharts$;
    // }

    public stateRealisasiCharts$: Observable<any>;
    getRealisasiCharts(event, reset = false) {
        let apiParams = {};
        if (event) {
            apiParams = {
                page: ((event.first + event.rows) / event.rows).toString(),
                length: event.rows.toString(),
                search: event.globalFilter,
                sort: event.sortField,
                sort_dir: event.sortOrder === -1 ? "desc" : null,
                persen: event.filters?.persen
                    ? event.filters["persen"]["value"]["value"]
                    : null,
                
            };
            Object.entries(apiParams).forEach((o) =>
                o[1] === null || o[1] === undefined || o[1] === "false"
                    ? delete apiParams[o[0]]
                    : 0
            );
        }
        if (
            !this.stateRealisasiCharts$ ||
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
            this.stateRealisasiCharts$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}realTahun`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
            this.stateRealisasiCharts$.subscribe(
                (content) => (this.datas = content["data"])
            );
            this.refresh = false;
        }

        return this.stateRealisasiCharts$;
    }

    getPotensiWilayahCharts(refresh = false) {
        if (!this.stateChart3$ || refresh || this.refreshChart) {
            this.getToken();
            this.stateChart3$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}potensiwilayah`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }
        return this.stateChart3$;
    }

    getPotensiPenerimaanCharts(refresh = false) {
        if (!this.stateChart4$ || refresh || this.refreshChart) {
            this.getToken();
            this.stateChart4$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}potensipenerimaan`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }
        return this.stateChart4$;
    }

    getPenerimaaniCharts(refresh = false) {
        if (!this.stateChart2$ || refresh || this.refreshChart) {
            this.getToken();
            this.stateChart2$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}penerimaanPAD`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }
        return this.stateChart2$;
    }

    getTargetSimulasiCharts(refresh = false) {
        if (!this.stateChart4$ || refresh || this.refreshChart) {
            this.getToken();
            this.stateChart4$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}chartTarget`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }
        return this.stateChart4$;
    }

    // getPoint(point) {
    //     this.getToken();
    //     return this.http.get<any>(
    //         `${environment.appBackendUrl}${point}`,
    //         this.httpOptions
    //     );
    // }

    //   updatePendaftaran(id:number, data:any) {
    //     return this.http.put(`${environment.appBackendUrl}UpdatePendaftaran/${id}`, data, this.httpOptions);
    //   }

    //   addPendaftaran(data:any) {
    //     this.getToken();
    //     this.httpOptions['params'] = new HttpParams();
    //     return this.http.post(`${environment.appBackendUrl}AddPendaftaran`, data, this.httpOptions);
    //   }

    //   addPendaftaranDet(id:number, data:any) {
    //     this.getToken();
    //     this.httpOptions['params'] = new HttpParams();
    //     return this.http.post(`${environment.appBackendUrl}AddPendaftaranRekening/${id}`, data, this.httpOptions);
    //   }

    //   delPendaftaran(id:number) {
    //     this.getToken();
    //     return this.http.delete(`${environment.appBackendUrl}DeletePendaftaran/${id}`, this.httpOptions);
    //   }

    //   delPendaftarans(data:any) {
    //     this.getToken();
    //     console.log(data);
    //     this.httpOptions['body'] = data;
    //     return this.http.delete(`${environment.appBackendUrl}DeletePendaftarans`, this.httpOptions);
    //   }

    //   getViewPendaftaran(){
    //     this.getToken();
    //     // this.httpOptions['params'] = new HttpParams().set('page', '1');
    //     return this.http.get<any>(`${environment.appBackendUrl}MsWPDataall2`, this.httpOptions);
    //   }

    //   getViewPendaftaranLazy(event){
    //     this.getToken();
    //     let apiParams = {
    //       'page': ((event.first+event.rows)/event.rows).toString(),
    //       'length': event.rows.toString(),
    //       'search': event.globalFilter,
    //       'sort': event.sortField,
    //       'sort_dir': event.sortOrder === -1 ? 'desc' : null,
    //       'search_jenis': event.filters['search_jenis'] != undefined ? event.filters['search_jenis']['value'].toString():null,
    //       'nonwp': event.filters['nonwp'] != undefined ? event.filters['nonwp']['value']['checked'].toString():null,
    //     };
    //     Object.entries(apiParams).forEach( o => (
    //       o[1] === null ||
    //       o[1] === undefined ||
    //       o[1] === 'false'
    //       ? delete apiParams[o[0]] : 0));

    //     this.httpOptions['params'] = new HttpParams({ fromObject:apiParams });
    //     // return this.http.get<any>(`${environment.appBackendUrl}MsWPData`, this.httpOptions);
    //     return this.http.get<any>(`${environment.appBackendUrl}MsWPData`, this.httpOptions);
    //   }

    //   getEditPendaftaran1(id){
    //     this.getToken();
    //     return this.http.get<any>(`${environment.appBackendUrl}MsWPDataall3/${id}`, this.httpOptions);
    //   }

    //   getEditPendaftaran(){
    //     this.getToken();
    //     return this.http.get<any>(`${environment.appBackendUrl}MsWPDataall3`, this.httpOptions);
    //   }

    //   getPendapatan(){
    //     this.getToken();
    //     return this.http.get<any>(`${environment.appBackendUrl}MsJenisPendapatanall2`, this.httpOptions);
    //   }

    //   getJenisUsaha(){
    //     this.getToken();
    //     return this.http.get<any>(`${environment.appBackendUrl}MsGrupUsahaall2`, this.httpOptions);
    //   }

    //   getKlasifikasi(){
    //     this.getToken();
    //     return this.http.get<any>(`${environment.appBackendUrl}MsKlasifikasiUsahaall2`, this.httpOptions);
    //   }

    //   getKhusus(){
    //     this.getToken();
    //     return this.http.get<any>(`${environment.appBackendUrl}MsLokasiKhususall2`, this.httpOptions);
    //   }

    //   getKota(){
    //     this.getToken();
    //     return this.http.get<any>(`${environment.appBackendUrl}MsKotaall2`, this.httpOptions);
    //   }

    //   getCities(search){
    //     this.getToken();
    //     return this.http.get<any>(`${environment.appBackendUrl}MsKotaall2?search=${search}`, this.httpOptions);
    //   }

    //   getRw(kelurahan_id){
    //     this.getToken();
    //     return this.http.get<any>(`${environment.appBackendUrl}MsRWall2/${kelurahan_id}`, this.httpOptions);
    //   }

    //   getPegawai(search:string){
    //     this.getToken();
    //     return this.http.get<any>(`${environment.appBackendUrl}MsPegawaiall2?search=${search}`, this.httpOptions);
    //   }

    //   getBiodata() {
    //     this.getToken();
    //     return this.http.get(`${environment.appBackendUrl}biodata`, this.httpOptions);
    //   }

    //   getLaporan(){
    //     this.getToken();
    //     return this.http.get<TreeNode>(`${environment.appBackendUrl}RptHead`, this.httpOptions);
    //   }

    //   getUser(){
    //     this.getToken();
    //     return this.http.get<any>(`${environment.appBackendUrl}tblUser`, this.httpOptions);
    //   }

    //   getGroupUser(){
    //     this.getToken();
    //     return this.http.get<any>(`${environment.appBackendUrl}tblGroupUser`, this.httpOptions);
    //   }

    //   getQuery(query){
    //     this.getToken();
    //     return this.http.get<any>(`${environment.appBackendUrl}pendaftaran/${query}`, this.httpOptions);
    //   }

    //   getJns(){
    //     this.getToken();
    //     return this.http.get<any>(`${environment.appBackendUrl}penonaktifan/jns`, this.httpOptions);
    //   }

    //   getPendDet(){
    //     this.getToken();
    //     return this.http.get<any>(`${environment.appBackendUrl}pendaftaran/penddet`, this.httpOptions);
    //   }
}
