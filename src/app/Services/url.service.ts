import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
const CACHE_SIZE = 1;
@Injectable({
    providedIn: "root",
})

export class UrlService {
    httpOptions: any;

    constructor(private http: HttpClient,
    private jwtHelper: JwtHelperService
    ) {}

    getToken() {
        var token = localStorage.getItem("userInfo");
        if (token != null) {
            var tkn = JSON.parse(token);
            this.httpOptions = {
                headers: new HttpHeaders({
                    APIKey: `${tkn.APIkey}`,
                }),
            };
        }
    }

    public stateUrl$: Observable<any>;
    getUrl() {
        if (!this.stateUrl$) {
            this.getToken();
            this.stateUrl$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}tblUrlall2`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }
        return this.stateUrl$;
    }

    public stateDataUrlLazy$: Observable<any>;
    public stateApiPar: any;
    getDataUrlLazy(event: any, reset: boolean = false) {
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
            !this.stateDataUrlLazy$ ||
            JSON.stringify(this.stateApiPar) !== JSON.stringify(apiParams) ||
            reset
        ) {
            this.stateApiPar = { ...apiParams };
            this.getToken();

            this.httpOptions["params"] = new HttpParams({
                fromObject: apiParams,
            });
            this.stateDataUrlLazy$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}tblUrl`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }

        return this.stateDataUrlLazy$;
    }

    postDataUrl(data: any) {
        this.getToken();
        return this.http.post<any>(
            `${environment.appBackendUrl}tblUrl`,
            data,
            this.httpOptions
        );
    }

    putDataUrl(id: string, data: any) {
        this.getToken();
        return this.http.put<any>(
            `${environment.appBackendUrl}tblUrl/${id}`,
            data,
            this.httpOptions
        );
    }

    delDataUrl(id: string) {
        this.getToken();
        return this.http.delete<any>(
            `${environment.appBackendUrl}tblUrl/${id}`,
            this.httpOptions
        );
    }

    // getDatas() {
    //     this.getToken();
    //     return this.http
    //         .get<any[]>(`${environment.appBackendUrl}url`, this.httpOptions)
    //         .pipe(map((content) => content["data"]));
    // }

    // postData(data: any) {
    //     this.getToken();
    //     Object.entries(data).forEach((o) =>
    //         o[1] === null || o[1] === undefined || o[1] === ""
    //             ? delete data[o[0]]
    //             : 0
    //     );
    //     this.httpOptions["params"] = new HttpParams();
    //     return this.http
    //         .post(`${environment.appBackendUrl}url`, data, this.httpOptions)
    //         .pipe(map((content) => content["data"]));
    // }

    // putData(data: any) {
    //     this.getToken();
    //     Object.entries(data).forEach((o) =>
    //         o[1] === null || o[1] === undefined || o[1] === ""
    //             ? delete data[o[0]]
    //             : 0
    //     );
    //     this.httpOptions["params"] = new HttpParams();
    //     return this.http.put(
    //         `${environment.appBackendUrl}url/${data.GroupId}`,
    //         data,
    //         this.httpOptions
    //     );
    // }

    // deleteData(id: number) {
    //     this.getToken();
    //     return this.http
    //         .delete(
    //             `${environment.appBackendUrl}url/${id}`,
    //             this.httpOptions
    //         )
    //         .pipe(map((content) => content["data"]));
    // }

    // public stateDataUrl$: Observable<any>;
    // readUrl(reset = false) {
    //     if (!this.stateDataUrl$ || reset) {
    //         this.getToken();
    //         this.stateDataUrl$ = this.http.get<any>(
    //             `${environment.appBackendUrl}url`,
    //             this.httpOptions
    //         );
    //     }

    //     return this.stateDataUrl$;
    // }
}
