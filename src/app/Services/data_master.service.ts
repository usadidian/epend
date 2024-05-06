import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { JwtHelperService } from "@auth0/angular-jwt";
import { TreeNode } from "primeng/api";
import { BehaviorSubject, Observable } from "rxjs";
import { map, shareReplay, switchMap, tap } from "rxjs/operators";
import { TreeviewItem } from "ngx-treeview";

const CACHE_SIZE = 1;

@Injectable({
    providedIn: "root",
})
export class DataMasterService {
    [x: string]: any;
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
                    // 'Content-Type': 'application/json',
                    APIKey: `${tkn.APIkey}`,
                }),
            };
        }
    }

    public isAuthenticated(): boolean {
        const token = localStorage.getItem("userInfo");
        // const decodedToken = this.jwtHelper.decodeToken(token);
        // const expirationDate = this.jwtHelper.getTokenExpirationDate(token);
        // const isExpired = this.jwtHelper.isTokenExpired(token);
        return !this.jwtHelper.isTokenExpired(token);
    }

    //#region Data PEGAWAI
    // public stateGeneralParameter$: Observable<any>;
    // getGeneralParameter(reset: boolean = false) {
    //     if (!this.stateGeneralParameter$ || reset) {
    //         this.getToken();
    //         this.stateGeneralParameter$ = this.http
    //             .get<any>(
    //                 `${environment.appBackendUrl}GeneralParameter`,
    //                 this.httpOptions
    //             )
    //             .pipe(shareReplay(CACHE_SIZE));
    //     }
    //     return this.stateGeneralParameter$;
    // }

    public stateGeneralParameter$: Observable<any>;
    public stateApi: any;
    getGeneralParameter(event, reset = false) {
        let apiParams = {};
        // console.log(event);
        if (event) {
            apiParams = {
                page: ((event.first + event.rows) / event.rows).toString(),
                length: event.rows.toString(),
                search: event.globalFilter,
                sort: event.sortField,
                sort_dir: event.sortOrder === -1 ? "desc" : null,
                // pegawaiid: event.filters["pegawaiid"]
                //     ? event.filters["pegawaiid"]["value"][
                //           "PegawaiID"
                //       ]
                //     : null,
            };
            Object.entries(apiParams).forEach((o) =>
                o[1] === null || o[1] === undefined || o[1] === "false"
                    ? delete apiParams[o[0]]
                    : 0
            );
        }
        if (
            !this.stateGeneralParameter$ ||
            JSON.stringify(this.stateApi) !== JSON.stringify(apiParams) ||
            reset
        ) {
            this.stateApi = { ...apiParams };
            this.getToken();

            this.httpOptions["params"] = new HttpParams({
                fromObject: apiParams,
            });
            this.stateGeneralParameter$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}GeneralParameter`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }

        return this.stateGeneralParameter$;
    }

    postGeneralParameter(data: any) {
        this.getToken();
        return this.http.post<any>(
            `${environment.appBackendUrl}GeneralParameter`,
            data,
            this.httpOptions
        );
    }

    putGeneralParameter(id: string, data: any) {
        this.getToken();
        return this.http.put<any>(
            `${environment.appBackendUrl}GeneralParameter/${id}`,
            data,
            this.httpOptions
        );
    }

    delGeneralParameter(id: string) {
        this.getToken();
        return this.http.delete<any>(
            `${environment.appBackendUrl}GeneralParameter/${id}`,
            this.httpOptions
        );
    }

    //#region KLASIFIKASI
    public stateKlasifikasi$: Observable<any>;
    getKlasifikasi(reset = false) {
        if (!this.stateKlasifikasi$ || reset) {
            this.getToken();
            this.stateKlasifikasi$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}MsKlasifikasiUsahaall2`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }
        return this.stateKlasifikasi$;
    }

    postKlasifikasi(data: any) {
        this.getToken();
        return this.http.post<any>(
            `${environment.appBackendUrl}MsKlasifikasiUsaha`,
            data,
            this.httpOptions
        );
    }

    putKlasifikasi(id: string, data: any) {
        this.getToken();
        return this.http.put<any>(
            `${environment.appBackendUrl}MsKlasifikasiUsaha/${id}`,
            data,
            this.httpOptions
        );
    }

    delKlasifikasi(id: string) {
        this.getToken();
        return this.http.delete<any>(
            `${environment.appBackendUrl}MsKlasifikasiUsaha/${id}`,
            this.httpOptions
        );
    }

    //#region JENISUSAHA
    public stateJenisUsaha$: Observable<any>;
    getJenisUsaha(reset = false) {
        if (!this.stateJenisUsaha$ || reset) {
            this.getToken();
            this.stateJenisUsaha$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}MsJenisUsaha`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }
        return this.stateJenisUsaha$;
    }

    public stateJenisUsaha2$: Observable<any>;
    getJenisUsaha2(reset = false) {
        if (!this.stateJenisUsaha2$ || reset) {
            this.getToken();
            this.stateJenisUsaha2$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}MsGrupUsahaall2`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }
        return this.stateJenisUsaha2$;
    }

    // getJenisUsaha() {
    //     this.getToken();
    //     return this.http.get<any>(`${environment.appBackendUrl}MsJenisUsaha`, this.httpOptions);
    // }

    postJenisUsaha(data: any) {
        this.getToken();
        return this.http.post<any>(
            `${environment.appBackendUrl}MsJenisUsaha`,
            data,
            this.httpOptions
        );
    }

    putJenisUsaha(id: string, data: any) {
        this.getToken();
        return this.http.put<any>(
            `${environment.appBackendUrl}MsJenisUsaha/${id}`,
            data,
            this.httpOptions
        );
    }

    delJenisUsaha(id: string) {
        this.getToken();
        return this.http.delete<any>(
            `${environment.appBackendUrl}MsJenisUsaha/${id}`,
            this.httpOptions
        );
    }

    //#region UPTD
    public stateuptd$: Observable<any>;
    getuptd(reset = false) {
        if (!this.stateuptd$ || reset) {
            this.getToken();
            this.stateuptd$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}MsUPTD`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }
        return this.stateuptd$;
    }

    public stateuptd2$: Observable<any>;
    getuptd2(reset = false) {
        if (!this.stateuptd2$ || reset) {
            this.getToken();
            this.stateuptd2$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}MsUPTDall2`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }
        return this.stateuptd2$;
    }

    // getuptd() {
    //     this.getToken();
    //     return this.http.get<any>(`${environment.appBackendUrl}Msuptd`, this.httpOptions);
    // }

    postuptd(data: any) {
        this.getToken();
        return this.http.post<any>(
            `${environment.appBackendUrl}MsUPTD`,
            data,
            this.httpOptions
        );
    }

    putuptd(id: string, data: any) {
        this.getToken();
        return this.http.put<any>(
            `${environment.appBackendUrl}MsUPTD/${id}`,
            data,
            this.httpOptions
        );
    }

    deluptd(id: string) {
        this.getToken();
        return this.http.delete<any>(
            `${environment.appBackendUrl}MsUPTD/${id}`,
            this.httpOptions
        );
    }

    //end region UPTD

    //#region TARGET PENDAPATAN
    public stateTargetPend$: Observable<any>;
    public stateLastApiParams: any;
    getTargetPend(event, reset = false) {
        let apiParams = {};
        // console.log(event);
        if (event) {
            apiParams = {
                page: ((event.first + event.rows) / event.rows).toString(),
                length: event.rows.toString(),
                search: event.globalFilter,
                sort: event.sortField,
                sort_dir: event.sortOrder === -1 ? "desc" : null,
                search_jenis: event.filters?.search_jenis
                    ? event.filters["search_jenis"]["value"]["value"]
                    : null,
                filter_jenis: event.filters["filter_jenis"]
                    ? event.filters["filter_jenis"]["value"][
                          "JenisPendapatanID"
                      ]
                    : null,
                filter_uptid: event.filters["filter_uptid"]
                    ? event.filters["filter_uptid"]["value"]["UPTID"]
                    : null,
                tahun_pendapatan: event.filters["tahun_pendapatan"]
                    ? event.filters["tahun_pendapatan"]["value"]["value"]
                    : null,
                Periode: event.filters["filter_periode"]
                    ? event.filters["filter_periode"]["value"]["value"]
                    : null,
            };
            Object.entries(apiParams).forEach((o) =>
                o[1] === null || o[1] === undefined || o[1] === "false"
                    ? delete apiParams[o[0]]
                    : 0
            );
        }
        if (
            !this.stateTargetPend$ ||
            JSON.stringify(this.stateLastApiParams) !==
                JSON.stringify(apiParams) ||
            reset
        ) {
            this.stateLastApiParams = { ...apiParams };
            this.getToken();

            this.httpOptions["params"] = new HttpParams({
                fromObject: apiParams,
            });
            this.stateTargetPend$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}MsTargetPendapatan`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }

        return this.stateTargetPend$;
    }

    putTargetPend(id: string, data: any) {
        this.getToken();
        return this.http.put<any>(
            `${environment.appBackendUrl}MsTargetPendapatan/${id}`,
            data,
            this.httpOptions
        );
    }

    postTargetPend(data: any) {
        this.getToken();
        return this.http.post<any>(
            `${environment.appBackendUrl}MsTargetPendapatan`,
            data,
            this.httpOptions
        );
    }

    delTargetPend(id: string) {
        this.getToken();
        return this.http.delete<any>(
            `${environment.appBackendUrl}MsTargetPendapatan/${id}`,
            this.httpOptions
        );
    }
    //#endregion

    //#region GRUPUSAHA
    public stateGrupUsaha$: Observable<any>;
    getGrupUsaha(reset = false) {
        if (!this.stateGrupUsaha$ || reset) {
            this.getToken();
            this.stateGrupUsaha$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}MsGrupUsaha`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }
        return this.stateGrupUsaha$;
    }

    postGrupUsaha(data: any) {
        this.getToken();
        return this.http.post<any>(
            `${environment.appBackendUrl}MsGrupUsaha`,
            data,
            this.httpOptions
        );
    }

    putGrupUsaha(id: string, data: any) {
        this.getToken();
        return this.http.put<any>(
            `${environment.appBackendUrl}MsGrupUsaha/${id}`,
            data,
            this.httpOptions
        );
    }

    delGrupUsaha(id: string) {
        this.getToken();
        return this.http.delete<any>(
            `${environment.appBackendUrl}MsGrupUsaha/${id}`,
            this.httpOptions
        );
    }
    //#region

    //#region JENISPUNGUT
    public stateJenisPungut$: Observable<any>;
    getJenisPungut(reset = false) {
        if (!this.stateJenisPungut$ || reset) {
            this.getToken();
            this.stateJenisPungut$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}MsJenisPungut`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }
        return this.stateJenisPungut$;
    }

    postJenisPungut(data: any) {
        this.getToken();
        return this.http.post<any>(
            `${environment.appBackendUrl}MsJenisPungut`,
            data,
            this.httpOptions
        );
    }

    putJenisPungut(id: string, data: any) {
        this.getToken();
        return this.http.put<any>(
            `${environment.appBackendUrl}MsJenisPungut/${id}`,
            data,
            this.httpOptions
        );
    }

    delJenisPungut(id: string) {
        this.getToken();
        return this.http.delete<any>(
            `${environment.appBackendUrl}MsJenisPungut/${id}`,
            this.httpOptions
        );
    }
    //#region

    //#region SATUAN KERJA
    public stateSatuanKerja$: Observable<any>;
    getSatuanKerja(reset: boolean = false, params: any = {}) {
        if (!this.stateSatuanKerja$ || reset) {
            this.getToken();
            this.httpOptions["params"] = new HttpParams({
                fromObject: params,
            });
            this.stateSatuanKerja$ = this.http
                .get<any>(`${environment.appBackendUrl}MsUPT`, this.httpOptions)
                .pipe(shareReplay(CACHE_SIZE));
        }
        return this.stateSatuanKerja$;
    }

    public getSatuanKerja1$: Observable<any>;
    public stateApiPars: any;
    getSatuanKerja1(event, reset = false) {
        let apiParams = {};
        // console.log(event);
        if (event) {
            apiParams = {
                page: ((event.first + event.rows) / event.rows).toString(),
                length: event.rows.toString(),
                search: event.globalFilter,
                sort: event.sortField,
                sort_dir: event.sortOrder === -1 ? "desc" : null,
                // pegawaiid: event.filters["pegawaiid"]
                //     ? event.filters["pegawaiid"]["value"][
                //           "PegawaiID"
                //       ]
                //     : null,
            };
            Object.entries(apiParams).forEach((o) =>
                o[1] === null || o[1] === undefined || o[1] === "false"
                    ? delete apiParams[o[0]]
                    : 0
            );
        }
        if (
            !this.getSatuanKerja1$ ||
            JSON.stringify(this.stateApiPars) !== JSON.stringify(apiParams) ||
            reset
        ) {
            this.stateApiParm = { ...apiParams };
            this.getToken();

            this.httpOptions["params"] = new HttpParams({
                fromObject: apiParams,
            });
            this.getSatuanKerja1$ = this.http
                .get<any>(`${environment.appBackendUrl}MsUPT`, this.httpOptions)
                .pipe(shareReplay(CACHE_SIZE));
        }

        return this.getSatuanKerja1$;
    }

    postSatuanKerja(data: any) {
        this.getToken();
        return this.http.post<any>(
            `${environment.appBackendUrl}MsUPT`,
            data,
            this.httpOptions
        );
    }

    putSatuanKerja(id: string, data: any) {
        this.getToken();
        return this.http.put<any>(
            `${environment.appBackendUrl}MsUPT/${id}`,
            data,
            this.httpOptions
        );
    }

    delSatuanKerja(id: string) {
        this.getToken();
        return this.http.delete<any>(
            `${environment.appBackendUrl}MsUPT/${id}`,
            this.httpOptions
        );
    }
    //#region

    //#region Data PEGAWAI
    public stateDataPegawai$: Observable<any>;
    getDataPegawai(reset: boolean = false) {
        if (!this.stateDataPegawai$ || reset) {
            this.getToken();
            this.stateDataPegawai$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}MsPegawai`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }
        return this.stateDataPegawai$;
    }

    public stateDataPegawaiLazy$: Observable<any>;
    getDataPegawaiLazy(event: any, reset: boolean = false) {
        let apiParams = {};
        // console.log(event);
        if (event) {
            apiParams = {
                page: ((event.first + event.rows) / event.rows).toString(),
                length: event.rows.toString(),
                search: event.globalFilter,
                sort: event.sortField,
                sort_dir: event.sortOrder === -1 ? "desc" : null,
                // pegawaiid: event.filters["pegawaiid"]
                //     ? event.filters["pegawaiid"]["value"][
                //           "PegawaiID"
                //       ]
                //     : null,
            };
            Object.entries(apiParams).forEach((o) =>
                o[1] === null || o[1] === undefined || o[1] === "false"
                    ? delete apiParams[o[0]]
                    : 0
            );
        }
        if (
            !this.stateDataPegawaiLazy$ ||
            JSON.stringify(this.stateApiPars) !== JSON.stringify(apiParams) ||
            reset
        ) {
            this.stateApiParm = { ...apiParams };
            this.getToken();

            this.httpOptions["params"] = new HttpParams({
                fromObject: apiParams,
            });
            this.stateDataPegawaiLazy$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}MsPegawai`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }

        return this.stateDataPegawaiLazy$;
    }

    public stateDataPegawaiBend$: Observable<any>;
    getDataPegawaiBend(reset: boolean = false) {
        if (!this.stateDataPegawai$ || reset) {
            this.getToken();
            this.stateDataPegawai$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}MsPegawaiall5`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }
        return this.stateDataPegawai$;
    }

    postDataPegawai(data: any) {
        this.getToken();
        return this.http.post<any>(
            `${environment.appBackendUrl}MsPegawai`,
            data,
            this.httpOptions
        );
    }

    putDataPegawai(id: string, data: any) {
        this.getToken();
        return this.http.put<any>(
            `${environment.appBackendUrl}MsPegawai/${id}`,
            data,
            this.httpOptions
        );
    }

    delDataPegawai(id: string) {
        this.getToken();
        return this.http.delete<any>(
            `${environment.appBackendUrl}MsPegawai/${id}`,
            this.httpOptions
        );
    }
    //#region
    //#region Data BENDAHARA
    public stateDataBendahara$: Observable<any>;
    getDataBendahara() {
        if (!this.stateDataBendahara$) {
            this.getToken();
            this.stateDataBendahara$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}MsBendahara5`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }
        return this.stateDataBendahara$;
    }

    public stateDataBendahara2$: Observable<any>;
    public stateApiParm: any;
    getDataBendahara2(event, reset = false) {
        let apiParams = {};
        // console.log(event);
        if (event) {
            apiParams = {
                page: ((event.first + event.rows) / event.rows).toString(),
                length: event.rows.toString(),
                search: event.globalFilter,
                sort: event.sortField,
                sort_dir: event.sortOrder === -1 ? "desc" : null,
                // pegawaiid: event.filters["pegawaiid"]
                //     ? event.filters["pegawaiid"]["value"][
                //           "PegawaiID"
                //       ]
                //     : null,
            };
            Object.entries(apiParams).forEach((o) =>
                o[1] === null || o[1] === undefined || o[1] === "false"
                    ? delete apiParams[o[0]]
                    : 0
            );
        }
        if (
            !this.stateDataBendahara2$ ||
            JSON.stringify(this.stateApiParm) !== JSON.stringify(apiParams) ||
            reset
        ) {
            this.stateApiParm = { ...apiParams };
            this.getToken();

            this.httpOptions["params"] = new HttpParams({
                fromObject: apiParams,
            });
            this.stateDataBendahara2$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}MsBendahara`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }

        return this.stateDataBendahara2$;
    }

    postDataBendahara(data: any) {
        this.getToken();
        return this.http.post<any>(
            `${environment.appBackendUrl}MsBendahara`,
            data,
            this.httpOptions
        );
    }

    putDataBendahara(id: string, data: any) {
        this.getToken();
        return this.http.put<any>(
            `${environment.appBackendUrl}MsBendahara/${id}`,
            data,
            this.httpOptions
        );
    }

    delDataBendahara(id: string) {
        this.getToken();
        return this.http.delete<any>(
            `${environment.appBackendUrl}MsBendahara/${id}`,
            this.httpOptions
        );
    }
    //#region

    //#region JENISUSAHA
    public stateJenisPerolehan$: Observable<any>;
    getJenisPerolehan(reset = false) {
        if (!this.stateJenisPerolehan$ || reset) {
            this.getToken();
            this.stateJenisPerolehan$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}MsJenisUsaha?jenis_perolehan=1`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }
        return this.stateJenisPerolehan$;
    }
    //#region

    //#region REKENING

    public stateDataRekening$: Observable<any>;
    getDataRekening(reset: boolean = false, params: any = {}) {
        if (!this.stateDataRekening$ || reset) {
            this.getToken();
            this.httpOptions["params"] = new HttpParams({
                fromObject: params,
            });
            this.stateDataRekening$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}MATANGD`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }
        return this.stateDataRekening$;
    }

    getMATANGDall2() {
        this.getToken();
        return this.http.get<any>(
            `${environment.appBackendUrl}MATANGDall2`,
            this.httpOptions
        );
    }

    getMATANGDall3() {
        this.getToken();
        return this.http.get<any>(
            `${environment.appBackendUrl}MATANGDall3`,
            this.httpOptions
        );
    }


    postDataRekening(data: any) {
        this.getToken();
        return this.http.post<any>(
            `${environment.appBackendUrl}MATANGD`,
            data,
            this.httpOptions
        );
    }

    putDataRekening(id: string, data: any) {
        this.getToken();
        return this.http.put<any>(
            `${environment.appBackendUrl}MATANGD/${id}`,
            data,
            this.httpOptions
        );
    }

    delDataRekening(id: string) {
        this.getToken();
        return this.http.delete<any>(
            `${environment.appBackendUrl}MATANGD/${id}`,
            this.httpOptions
        );
    }

    public stateDataPotensi$: Observable<any>;
    getDataPotensi(reset: boolean = false, params: any = {}) {
        if (!this.stateDataPotensi$ || reset) {
            this.getToken();
            this.httpOptions["params"] = new HttpParams({
                fromObject: params,
            });
            this.stateDataPotensi$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}MsPotensi`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }
        return this.stateDataPotensi$;
    }

    getDataPotensiall2() {
        this.getToken();
        return this.http.get<any>(
            `${environment.appBackendUrl}MsPotensiall2`,
            this.httpOptions
        );
    }

    postDataPotensi(data: any) {
        this.getToken();
        return this.http.post<any>(
            `${environment.appBackendUrl}MsPotensi`,
            data,
            this.httpOptions
        );
    }

    putDataPotensi(id: string, data: any) {
        this.getToken();
        return this.http.put<any>(
            `${environment.appBackendUrl}MsPotensi/${id}`,
            data,
            this.httpOptions
        );
    }

    delDataPotensi(id: string) {
        this.getToken();
        return this.http.delete<any>(
            `${environment.appBackendUrl}MsPotensi/${id}`,
            this.httpOptions
        );
    }

    //#endregion

    public stateBend$: Observable<any>;
    getDataBend(uptid: string) {
        this.getToken();
        return this.http.get<any>(
            `${environment.appBackendUrl}MsBendaharaall3/${uptid}`,
            this.httpOptions
        );
    }

    public stateBendahara$: Observable<any>;
    getBendahara() {
        if (!this.stateBendahara$) {
            this.getToken();
            this.stateBendahara$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}MsBendaharaall2`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }
        return this.stateBendahara$;
    }

    public stateBank5$: Observable<any>;
    getBank5() {
        if (!this.stateBank$) {
            this.getToken();
            this.stateBank$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}MsBank5`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }
        return this.stateBank$;
    }

    public stateBank$: Observable<any>;
    getBank() {
        if (!this.stateBank$) {
            this.getToken();
            this.stateBank$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}MsBankall2`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }
        return this.stateBank$;
    }

    public stateDataBankLazy$: Observable<any>;
    getDataBankLazy(event: any, reset: boolean = false) {
        let apiParams = {};
        // console.log(event);
        if (event) {
            apiParams = {
                page: ((event.first + event.rows) / event.rows).toString(),
                length: event.rows.toString(),
                search: event.globalFilter,
                sort: event.sortField,
                sort_dir: event.sortOrder === -1 ? "desc" : null,
            };
            Object.entries(apiParams).forEach((o) =>
                o[1] === null || o[1] === undefined || o[1] === "false"
                    ? delete apiParams[o[0]]
                    : 0
            );
        }
        if (
            !this.stateDataBankLazy$ ||
            JSON.stringify(this.stateApiPars) !== JSON.stringify(apiParams) ||
            reset
        ) {
            this.stateApiParm = { ...apiParams };
            this.getToken();

            this.httpOptions["params"] = new HttpParams({
                fromObject: apiParams,
            });
            this.stateDataBankLazy$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}MsBank`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }

        return this.stateDataBankLazy$;
    }

    postDataBank(data: any) {
        this.getToken();
        return this.http.post<any>(
            `${environment.appBackendUrl}MsBank`,
            data,
            this.httpOptions
        );
    }

    putDataBank(id: string, data: any) {
        this.getToken();
        return this.http.put<any>(
            `${environment.appBackendUrl}MsBank/${id}`,
            data,
            this.httpOptions
        );
    }

    delDataBank(id: string) {
        this.getToken();
        return this.http.delete<any>(
            `${environment.appBackendUrl}MsBank/${id}`,
            this.httpOptions
        );
    }

    //#region UPT
    public stateUPT$: Observable<any>;
    getWilayahUpt() {
        if (!this.stateUPT$) {
            this.getToken();
            this.stateUPT$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}MsUPTall2`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }
        return this.stateUPT$;
    }
    public stateUPT5$: Observable<any>;
    getWilayahUpt2() {
        if (!this.stateUPT5$) {
            this.getToken();
            this.stateUPT5$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}MsUPTall5`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }
        return this.stateUPT5$;
    }

    // getWilayahUptd() {
    //     this.getToken();
    //     return this.http.get<any>(
    //         `${environment.appBackendUrl}MsUPTDall2`,
    //         this.httpOptions
    //     );
    // }

    getWilayahUptd(search: string) {
        this.getToken();
        return this.http.get<any>(
            `${environment.appBackendUrl}MsUPTDall2?search=${search}`,
            this.httpOptions
        );
    }

    // public stateUPTD$: Observable<any>;
    // getWilayahUptd() {
    //     if (!this.stateUPTD$) {
    //         this.getToken();
    //         this.stateUPTD$ = this.http
    //             .get<any>(
    //                 `${environment.appBackendUrl}MsUPTDall2`,
    //                 this.httpOptions
    //             )
    //             .pipe(shareReplay(CACHE_SIZE));
    //     }
    //     return this.stateUPTD$;
    // }

    public stateWapu5$: Observable<any>;
    getWapu2() {
        let dataReturn = [];
        if (!this.stateWapu5$) {
            this.getToken();
            this.stateWapu5$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}MsWapuall5`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }
        return this.stateWapu5$;
    }

    public stateMsWapuall2$: Observable<any>;
    getWapu3(search: string, length: number = 5) {
        if (!this.stateMsWapuall2$) {
            this.getToken();
            this.stateMsWapuall2$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}MsWapuall2?search=${
                        search ?? ""
                    }&length=${length}`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }

        return this.stateMsWapuall2$;
    }

    getWilayahUpt3() {
        this.getToken();
        return this.http.get<any>(
            `${environment.appBackendUrl}MsUPTall3`,
            this.httpOptions
        );
    }
    //#endregion

    getKhusus() {
        this.getToken();
        return this.http.get<any>(
            `${environment.appBackendUrl}MsLokasiKhususall2`,
            this.httpOptions
        );
    }

    getKota() {
        this.getToken();
        return this.http.get<any>(
            `${environment.appBackendUrl}MsKotaall2`,
            this.httpOptions
        );
    }

    public stateKecamatanKota$: Observable<any>;
    getKecamatanKota(reset = false) {
        if (!this.stateKecamatanKota$ || reset) {
            this.getToken();
            this.stateKecamatanKota$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}MsKecamatanall5`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }
        return this.stateKecamatanKota$;
    }
    public stateKecamatan$: Observable<any>;
    getKecamatanAll() {
        if (!this.stateKecamatan$) {
            this.getToken();
            this.stateKecamatan$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}MsKecamatanall4`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }
        return this.stateKecamatan$;
    }

    public stateKecamatanCurrent$: Observable<any>;
    public stateApiParkec: any;
    getKecamatanCurrent(event, reset = false) {
        let apiParams = {};
        // console.log(event);
        if (event) {
            apiParams = {
                page: ((event.first + event.rows) / event.rows).toString(),
                length: event.rows.toString(),
                search: event.globalFilter,
                sort: event.sortField,
                sort_dir: event.sortOrder === -1 ? "desc" : null,
                kotaid: event.filters["kotaid"]
                    ? event.filters["kotaid"]["value"]["KotaID"]
                    : null,
            };
            Object.entries(apiParams).forEach((o) =>
                o[1] === null || o[1] === undefined || o[1] === "false"
                    ? delete apiParams[o[0]]
                    : 0
            );
        }
        if (
            !this.stateKecamatanCurrent$ ||
            JSON.stringify(this.stateApiParkec) !== JSON.stringify(apiParams) ||
            reset
        ) {
            this.stateApiParkec = { ...apiParams };
            this.getToken();

            this.httpOptions["params"] = new HttpParams({
                fromObject: apiParams,
            });
            this.stateKecamatanCurrent$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}MsKecamatan`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }

        return this.stateKecamatanCurrent$;
    }

    postKecamatan(data: any) {
        this.getToken();
        return this.http.post<any>(
            `${environment.appBackendUrl}MsKecamatan`,
            data,
            this.httpOptions
        );
    }

    putKecamatan(id: string, data: any) {
        this.getToken();
        return this.http.put<any>(
            `${environment.appBackendUrl}MsKecamatan/${id}`,
            data,
            this.httpOptions
        );
    }

    delKecamatan(id: string) {
        this.getToken();
        return this.http.delete<any>(
            `${environment.appBackendUrl}MsKecamatan/${id}`,
            this.httpOptions
        );
    }

    public stateKelurahankec$: Observable<any>;
    public stateApiParmm: any;
    getKelurahankec(event, reset = false) {
        let apiParams = {};
        // console.log(event);
        if (event) {
            apiParams = {
                page: ((event.first + event.rows) / event.rows).toString(),
                length: event.rows.toString(),
                search: event.globalFilter,
                sort: event.sortField,
                sort_dir: event.sortOrder === -1 ? "desc" : null,
                kecamatanid: event.filters["kecamatanid"]
                    ? event.filters["kecamatanid"]["value"]["KecamatanID"]
                    : null,
            };
            Object.entries(apiParams).forEach((o) =>
                o[1] === null || o[1] === undefined || o[1] === "false"
                    ? delete apiParams[o[0]]
                    : 0
            );
        }
        if (
            !this.stateKelurahankec$ ||
            JSON.stringify(this.stateApiParm) !== JSON.stringify(apiParams) ||
            reset
        ) {
            this.stateApiParmm = { ...apiParams };
            this.getToken();

            this.httpOptions["params"] = new HttpParams({
                fromObject: apiParams,
            });
            this.stateKelurahankec$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}MsKelurahan`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }

        return this.stateKelurahankec$;
    }

    getKelurahan(search: string) {
        this.getToken();
        return this.http.get<any>(
            `${environment.appBackendUrl}MsKotaall2?search=${search}`,
            this.httpOptions
        );
    }

    getKelurahanCurrent(search: string) {
        this.getToken();
        return this.http.get<any>(
            `${environment.appBackendUrl}MsKotaall3?search=${search}`,
            this.httpOptions
        );
    }

    getKelurahanByUpt(search: string, uptid: string) {
        this.getToken();
        return this.http.get<any>(
            `${environment.appBackendUrl}MsKotaall2?search=${search}&uptid=${uptid}`,
            this.httpOptions
        );
    }

    postKelurahan(data: any) {
        this.getToken();
        return this.http.post<any>(
            `${environment.appBackendUrl}MsKelurahan`,
            data,
            this.httpOptions
        );
    }

    putKelurahan(id: string, data: any) {
        this.getToken();
        return this.http.put<any>(
            `${environment.appBackendUrl}MsKelurahan/${id}`,
            data,
            this.httpOptions
        );
    }

    delKelurahan(id: string) {
        this.getToken();
        return this.http.delete<any>(
            `${environment.appBackendUrl}MsKelurahan/${id}`,
            this.httpOptions
        );
    }

    getSatuanOmzet3() {
        this.getToken();
        return this.http.get<any>(
            `${environment.appBackendUrl}MsSatuanOmzetall3`,
            this.httpOptions
        );
    }

    getJnsPendOfficial() {
        this.getToken();
        return this.http.get<any>(
            `${environment.appBackendUrl}MsJenisPendapatanall3`,
            this.httpOptions
        );
    }

    getJnsPendDenda() {
        this.getToken();
        return this.http.get<any>(
            `${environment.appBackendUrl}MsJenisPendapatanall7`,
            this.httpOptions
        );
    }

    public stateJenisPendapatan$: Observable<any>;
    public stateApiParmn: any;
    getJenisPendapatan(event, reset = false) {
        let apiParams = {};
        // console.log(event);
        if (event) {
            apiParams = {
                page: ((event.first + event.rows) / event.rows).toString(),
                length: event.rows.toString(),
                search: event.globalFilter,
                sort: event.sortField,
                sort_dir: event.sortOrder === -1 ? "desc" : null,
                // search_jenis: event.filters?.search_jenis
                // ? event.filters["search_jenis"]["value"]["value"]
                // : null,
                filter_jenis: event.filters["filter_jenis"]
                    ? event.filters["filter_jenis"]["value"]["value"]
                    : null,
                    kategori: event.filters["kategori"]
                    ? event.filters["kategori"]["value"].toString()
                    : "true",
            };
            Object.entries(apiParams).forEach((o) =>
                o[1] === null || o[1] === undefined || o[1] === "false"
                    ? delete apiParams[o[0]]
                    : 0
            );
        }
        if (
            !this.stateJenisPendapatan$ ||
            JSON.stringify(this.stateApiParm) !== JSON.stringify(apiParams) ||
            reset
        ) {
            this.stateApiParmn = { ...apiParams };
            this.getToken();

            this.httpOptions["params"] = new HttpParams({
                fromObject: apiParams,
            });
            this.stateJenisPendapatan$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}MsJenisPendapatan`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }

        return this.stateJenisPendapatan$;
    }
    postJenisPendapatan(data: any) {
        this.getToken();
        return this.http.post<any>(
            `${environment.appBackendUrl}MsJenisPendapatan`,
            data,
            this.httpOptions
        );
    }

    putJenisPendapatan(id: string, data: any) {
        this.getToken();
        return this.http.put<any>(
            `${environment.appBackendUrl}MsJenisPendapatan/${id}`,
            data,
            this.httpOptions
        );
    }

    delJenisPendapatan(id: string) {
        this.getToken();
        return this.http.delete<any>(
            `${environment.appBackendUrl}MsJenisPendapatan/${id}`,
            this.httpOptions
        );
    }

    public stateJnsPendapatanAll$: Observable<any>;
    getJnsPendAll() {
        if (!this.stateJnsPendapatanAll$) {
            this.getToken();
            this.stateJnsPendapatanAll$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}MsJenisPendapatan13all`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }
        return this.stateJnsPendapatanAll$;
    }

    public stateJnsPendapatan$: Observable<any>;
    getJnsPendapatan() {
        // return this.http.get<any>(`${environment.appBackendUrl}MsJenisPendapatanall2`, this.httpOptions);
        let dataReturn = [];
        if (!this.stateJnsPendapatan$) {
            this.getToken();
            this.stateJnsPendapatan$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}MsJenisPendapatanall2`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }

        return this.stateJnsPendapatan$;
    }

    public stateJnsUrl$: Observable<any>;
    getJnsUrl() {
        // return this.http.get<any>(`${environment.appBackendUrl}MsJenisPendapatanall2`, this.httpOptions);
        let dataReturn = [];
        if (!this.stateJnsUrl$) {
            this.getToken();
            this.stateJnsUrl$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}tblUrlall2`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }

        return this.stateJnsUrl$;
    }

    // public stateJnsPotensi$: Observable<any>;
    // getJnsPotensi(dataRow: any = null, reset = false) {
    //     // let dataReturn = [];
    //     if (!this.stateJnsPotensi$ || reset) {
    //         this.getToken();
    //         this.httpOptions["params"] = new HttpParams({
    //             fromObject: dataRow,
    //         });
    //         this.stateJnsPotensi$ = this.http
    //             .get<any>(
    //                 // `${environment.appBackendUrl}MsPotensiall`,
    //                 `${environment.appBackendUrl}DaftPotensiDtlall4`,
    //                 this.httpOptions
    //             )
    //             .pipe(shareReplay(CACHE_SIZE));
    //     }

    //     return this.stateJnsPotensi$;
    // }

    public stateJnsPotensi$: Observable<any>;
    getJnsPotensi(dataRow: any = null, reset = false) {
        // let dataReturn = [];
        if (!this.stateJnsPotensi$ || reset) {
            this.getToken();
            this.httpOptions["params"] = new HttpParams({
                fromObject: dataRow,
            });
            this.stateJnsPotensi$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}DaftPotensiDtlall4`,
                    // `${environment.appBackendUrl}MsPotensi`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }

        return this.stateJnsPotensi$;
    }

    public stateJnsPendapatan20$: Observable<any>;
    getJnsPendapatan20(wpid: string) {
        // return this.http.get<any>(`${environment.appBackendUrl}MsJenisPendapatanall2`, this.httpOptions);
        let dataReturn = [];
        if (!this.stateJnsPendapatan20$) {
            this.getToken();
            this.stateJnsPendapatan$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}MsJenisPendapatanall20/${wpid}`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }

        return this.stateJnsPendapatan20$;
    }

    public JnsPendapatanTarget$: Observable<any>;
    getJnsPendapatanTarget() {
        let dataReturn = [];
        if (!this.JnsPendapatanTarget$) {
            this.getToken();
            this.JnsPendapatanTarget$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}MsTargetPendapatanall2`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }

        return this.JnsPendapatanTarget$;
    }

    public stateJnsPendapatanSelf$: Observable<any>;
    getJnsPendapatanSelf() {
        let dataReturn = [];
        if (!this.stateJnsPendapatanSelf$) {
            this.getToken();
            this.stateJnsPendapatanSelf$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}MsJenisPendapatanall4`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }

        return this.stateJnsPendapatanSelf$;
    }
    // public stateJnsPendapatan$: Observable<any>;
    // getJnsPendapatan(reset: boolean = false, params: any = {}) {
    //     // return this.http.get<any>(`${environment.appBackendUrl}MsJenisPendapatanall2`, this.httpOptions);
    //     if (!this.stateJnsPendapatan$ || reset) {
    //         this.getToken();
    //         this.httpOptions["params"] = new HttpParams({
    //             fromObject: params,
    //         });
    //         this.stateJnsPendapatan$ = this.http
    //             .get<any>(
    //                 `${environment.appBackendUrl}MsJenisPendapatanall8`,
    //                 this.httpOptions
    //             )
    //             .pipe(shareReplay(CACHE_SIZE));
    //     }
    //     return this.stateJnsPendapatan$;
    // }

    public stateJnsPendapatan5$: Observable<any>;
    getJnsPendapatan5() {
        let dataReturn = [];
        if (!this.stateJnsPendapatan5$) {
            this.getToken();
            this.stateJnsPendapatan5$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}MsJenisPendapatanall5`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }

        return this.stateJnsPendapatan5$;
    }

    public stateJnsPendapatan6$: Observable<any>;
    getJnsPendapatan6() {
        let dataReturn = [];
        if (!this.stateJnsPendapatan6$) {
            this.getToken();
            this.stateJnsPendapatan6$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}MsJenisPendapatanall6`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }

        return this.stateJnsPendapatan6$;
    }

    getJnsTarif(id: string) {
        this.getToken();
        return this.http.get<any>(
            `${environment.appBackendUrl}MsTarifLokasiall2/${id}`,
            this.httpOptions
        );
    }

    public stateJenisTarif$: Observable<any>;
    public stateApiParms: any;
    getJenisTarif(event, reset = false) {
        let apiParams = {};
        // console.log(event);
        if (event) {
            apiParams = {
                page: ((event.first + event.rows) / event.rows).toString(),
                length: event.rows.toString(),
                search: event.globalFilter,
                sort: event.sortField,
                sort_dir: event.sortOrder === -1 ? "desc" : null,
                jenispendapatanid: event.filters["jenispendapatanid"]
                    ? event.filters["jenispendapatanid"]["value"][
                          "JenisPendapatanID"
                      ]
                    : null,
            };
            Object.entries(apiParams).forEach((o) =>
                o[1] === null || o[1] === undefined || o[1] === "false"
                    ? delete apiParams[o[0]]
                    : 0
            );
        }
        if (
            !this.stateJenisTarif$ ||
            JSON.stringify(this.stateApiParms) !== JSON.stringify(apiParams) ||
            reset
        ) {
            this.stateApiParms = { ...apiParams };
            this.getToken();

            this.httpOptions["params"] = new HttpParams({
                fromObject: apiParams,
            });
            this.stateJenisTarif$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}MsTarifLokasi`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }

        return this.stateJenisTarif$;
    }

    postJenisTarif(data: any) {
        this.getToken();
        return this.http.post<any>(
            `${environment.appBackendUrl}MsTarifLokasi`,
            data,
            this.httpOptions
        );
    }

    putJenisTarif(id: string, data: any) {
        this.getToken();
        return this.http.put<any>(
            `${environment.appBackendUrl}MsTarifLokasi/${id}`,
            data,
            this.httpOptions
        );
    }

    delJenisTarif(id: string) {
        this.getToken();
        return this.http.delete<any>(
            `${environment.appBackendUrl}MsTarifLokasi/${id}`,
            this.httpOptions
        );
    }

    //#region REKLAME
    public stateJenisReklame$: Observable<any>;
    getJenisReklame(reset = false) {
        if (!this.stateJenisReklame$ || reset) {
            this.getToken();
            this.stateJenisReklame$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}MsTipeLokasiall2`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }
        return this.stateJenisReklame$;
    }

    postJenisReklame(data: any) {
        this.getToken();
        return this.http.post<any>(
            `${environment.appBackendUrl}MsTipeLokasi`,
            data,
            this.httpOptions
        );
    }

    putJenisReklame(id: string, data: any) {
        this.getToken();
        return this.http.put<any>(
            `${environment.appBackendUrl}MsTipeLokasi/${id}`,
            data,
            this.httpOptions
        );
    }

    delJenisReklame(id: string) {
        this.getToken();
        return this.http.delete<any>(
            `${environment.appBackendUrl}MsTipeLokasi/${id}`,
            this.httpOptions
        );
    }
    //////////////////////////////// LokasiReklame
    public stateLokasiReklame$: Observable<any>;
    getLokasiReklame(reset = false) {
        if (!this.stateLokasiReklame$ || reset) {
            this.getToken();
            this.stateLokasiReklame$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}MsStrategisHdrall2`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }
        return this.stateLokasiReklame$;
    }

    postLokasiReklame(data: any) {
        this.getToken();
        return this.http.post<any>(
            `${environment.appBackendUrl}MsStrategisHdr`,
            data,
            this.httpOptions
        );
    }

    putLokasiReklame(id: string, data: any) {
        this.getToken();
        return this.http.put<any>(
            `${environment.appBackendUrl}MsStrategisHdr/${id}`,
            data,
            this.httpOptions
        );
    }

    delLokasiReklame(id: string) {
        this.getToken();
        return this.http.delete<any>(
            `${environment.appBackendUrl}MsStrategisHdr/${id}`,
            this.httpOptions
        );
    }

    // ////////////////////////////// NilaiStrategis
    public stateNilaiStrategis$: Observable<any>;
    public stateApiParams: any;
    getNilaiStrategis(event, reset = false) {
        let apiParams = {};
        // console.log(event);
        if (event) {
            apiParams = {
                page: ((event.first + event.rows) / event.rows).toString(),
                length: event.rows.toString(),
                search: event.globalFilter,
                sort: event.sortField,
                sort_dir: event.sortOrder === -1 ? "desc" : null,
                tipelokasiid: event.filters["tipelokasiid"]
                    ? event.filters["tipelokasiid"]["value"]["TipeLokasiID"]
                    : null,
            };
            Object.entries(apiParams).forEach((o) =>
                o[1] === null || o[1] === undefined || o[1] === "false"
                    ? delete apiParams[o[0]]
                    : 0
            );
        }
        if (
            !this.stateNilaiStrategis$ ||
            JSON.stringify(this.stateApiParams) !== JSON.stringify(apiParams) ||
            reset
        ) {
            this.stateApiParams = { ...apiParams };
            this.getToken();

            this.httpOptions["params"] = new HttpParams({
                fromObject: apiParams,
            });
            this.stateNilaiStrategis$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}MsStrategisHdrall3`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }

        return this.stateNilaiStrategis$;
    }

    postNilaiStrategis(data: any) {
        this.getToken();
        return this.http.post<any>(
            `${environment.appBackendUrl}MsStrategisDtl`,
            data,
            this.httpOptions
        );
    }

    putNilaiStrategis(id: string, data: any) {
        this.getToken();
        return this.http.put<any>(
            `${environment.appBackendUrl}MsStrategisDtl/${id}`,
            data,
            this.httpOptions
        );
    }

    delNilaiStrategis(id: string) {
        this.getToken();
        return this.http.delete<any>(
            `${environment.appBackendUrl}MsStrategisDtl/${id}`,
            this.httpOptions
        );
    }
    ///////////

    getStartegisReklameKawasan() {
        this.getToken();
        return this.http
            .get<any>(
                `${environment.appBackendUrl}MsStrategisDtlall1`,
                this.httpOptions
            )
            .toPromise();
    }

    getStartegisReklameJalan() {
        this.getToken();
        return this.http
            .get<any>(
                `${environment.appBackendUrl}MsStrategisDtlall2`,
                this.httpOptions
            )
            .toPromise();
    }

    getStartegisReklameSudutPandang() {
        this.getToken();
        return this.http
            .get<any>(
                `${environment.appBackendUrl}MsStrategisDtlall3`,
                this.httpOptions
            )
            .toPromise();
    }

    getStartegisReklameNilaiStrategis() {
        this.getToken();
        return this.http
            .get<any>(
                `${environment.appBackendUrl}MsStrategisDtlall4`,
                this.httpOptions
            )
            .toPromise();
    }

    getStartegisReklameNilaiKetinggian() {
        this.getToken();
        return this.http
            .get<any>(
                `${environment.appBackendUrl}MsStrategisDtlall5`,
                this.httpOptions
            )
            .toPromise();
    }

    getStartegisReklameKlasifikasi() {
        this.getToken();
        return this.http
            .get<any>(
                `${environment.appBackendUrl}MsStrategisDtlall6`,
                this.httpOptions
            )
            .toPromise();
    }

    getStartegisReklameKlasifikasi2() {
        this.getToken();
        return this.http
            .get<any>(
                `${environment.appBackendUrl}MsStrategisDtlall7`,
                this.httpOptions
            )
            .toPromise();
    }

    getNjopReklame(tipelokasiid: number) {
        this.getToken();
        return this.http
            .get<any>(
                `${environment.appBackendUrl}MsTitikLokasiHdrall2/${tipelokasiid}`,
                this.httpOptions
            )
            .toPromise();
    }

    // public stateNJOPReklame$: Observable<any>;
    // getNJOPReklame(reset = false) {
    //     if (!this.stateNJOPReklame$ || reset) {
    //         this.getToken();
    //         this.stateNJOPReklame$ = this.http
    //             .get<any>(
    //                 `${environment.appBackendUrl}MsTitikLokasiHdrall3`,
    //                 this.httpOptions
    //             )
    //             .pipe(shareReplay(CACHE_SIZE));
    //     }
    //     return this.stateNJOPReklame$;
    // }
    // ////////////////////////////// NilaiStrategis
    public stateNJOPReklame$: Observable<any>;
    public stateApiPar: any;
    getNJOPReklame(event, reset = false) {
        let apiParams = {};
        // console.log(event);
        if (event) {
            apiParams = {
                page: ((event.first + event.rows) / event.rows).toString(),
                length: event.rows.toString(),
                search: event.globalFilter,
                sort: event.sortField,
                sort_dir: event.sortOrder === -1 ? "desc" : null,
                tipelokasiid: event.filters["tipelokasiid"]
                    ? event.filters["tipelokasiid"]["value"]["TipeLokasiID"]
                    : null,
            };
            Object.entries(apiParams).forEach((o) =>
                o[1] === null || o[1] === undefined || o[1] === "false"
                    ? delete apiParams[o[0]]
                    : 0
            );
        }
        if (
            !this.stateNJOPReklame$ ||
            JSON.stringify(this.stateApiPar) !== JSON.stringify(apiParams) ||
            reset
        ) {
            this.stateApiPar = { ...apiParams };
            this.getToken();

            this.httpOptions["params"] = new HttpParams({
                fromObject: apiParams,
            });
            this.stateNJOPReklame$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}MsTitikLokasiHdrall3`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }

        return this.stateNJOPReklame$;
    }

    postNJOPReklame(data: any) {
        this.getToken();
        return this.http.post<any>(
            `${environment.appBackendUrl}MsTitikLokasiHdr`,
            data,
            this.httpOptions
        );
    }

    putNJOPReklame(id: string, data: any) {
        this.getToken();
        return this.http.put<any>(
            `${environment.appBackendUrl}MsTitikLokasiHdr/${id}`,
            data,
            this.httpOptions
        );
    }

    delNJOPReklame(id: string) {
        this.getToken();
        return this.http.delete<any>(
            `${environment.appBackendUrl}MsTitikLokasiHdr/${id}`,
            this.httpOptions
        );
    }
    ///////////

    getRw(kelurahan_id: string) {
        this.getToken();
        return this.http.get<any>(
            `${environment.appBackendUrl}MsRWall2/${kelurahan_id}`,
            this.httpOptions
        );
    }

    getWapu(search: string) {
        this.getToken();
        return this.http.get<any>(
            `${environment.appBackendUrl}MsWapuall2?search=${search}`,
            this.httpOptions
        );
    }

    public stateMsPegawaiall2$: Observable<any>;
    getPegawai(search: string, length: number = 5) {
        if (!this.stateMsPegawaiall2$) {
            this.getToken();
            this.stateMsPegawaiall2$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}MsPegawaiall2?search=${
                        search ?? ""
                    }&length=${length}`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }

        return this.stateMsPegawaiall2$;
    }

    getPenagih(uptid: string) {
        this.getToken();
        return this.http.get<any>(
            `${environment.appBackendUrl}MsPegawaiall3/${uptid}`,
            this.httpOptions
        );
    }

    getPegawaiBadan() {
        this.getToken();
        return this.http.get<any>(
            `${environment.appBackendUrl}MsPegawaiall31`,
            this.httpOptions
        );
    }

    getPaymentMethod() {
        this.getToken();
        return this.http.get<any>(
            `${environment.appBackendUrl}MsJenisStatusall3`,
            this.httpOptions
        );
    }

    public statePaymentMethodPenyetora$: Observable<any>;
    getPaymentMethodPenyetoran() {
        if (!this.statePaymentMethodPenyetora$) {
            this.getToken();
            this.statePaymentMethodPenyetora$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}MsJenisStatusall4`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }

        return this.statePaymentMethodPenyetora$;
    }

    getPenagih2() {
        this.getToken();
        return this.http.get<any>(
            `${environment.appBackendUrl}MsPegawaiall4`,
            this.httpOptions
        );
    }

    getBiodata() {
        this.getToken();
        return this.http.get(
            `${environment.appBackendUrl}biodata`,
            this.httpOptions
        );
    }

    getLaporan() {
        this.getToken();
        return this.http.get<TreeNode>(
            `${environment.appBackendUrl}RptHead`,
            this.httpOptions
        );
    }

    getUser() {
        this.getToken();
        return this.http.get<any>(
            `${environment.appBackendUrl}tblUser`,
            this.httpOptions
        );
    }

    getGroupUser() {
        this.getToken();
        return this.http.get<any>(
            `${environment.appBackendUrl}tblGroupUser`,
            this.httpOptions
        );
    }

    getQuery(query) {
        this.getToken();
        return this.http.get<any>(
            `${environment.appBackendUrl}pendaftaran/${query}`,
            this.httpOptions
        );
    }

    getJns() {
        this.getToken();
        return this.http.get<any>(
            `${environment.appBackendUrl}penonaktifan/jns`,
            this.httpOptions
        );
    }

    getPendDet() {
        this.getToken();
        return this.http.get<any>(
            `${environment.appBackendUrl}pendaftaran/penddet`,
            this.httpOptions
        );
    }
}
