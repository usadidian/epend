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

export class RoleService {
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


    public stateDataRoleLazy$: Observable<any>;
    public stateApiPar: any;
    getDataRoleLazy(event: any, reset: boolean = false) {
        let apiParams = {};
        // console.log(event);
        if (event) {
            apiParams = {
                page: ((event.first + event.rows) / event.rows).toString(),
                length: event.rows.toString(),
                search: event.globalFilter,
                sort: event.sortField,
                sort_dir: event.sortOrder === -1 ? "desc" : null,
                filter_groupid: event.filters["filter_groupid"]
                    ? event.filters["filter_groupid"]["value"]["GroupId"]
                    : null,
            };
            Object.entries(apiParams).forEach((o) =>
                o[1] === null || o[1] === undefined || o[1] === "false"
                    ? delete apiParams[o[0]]
                    : 0
            );
        }
        if (
            !this.stateDataRoleLazy$ ||
            JSON.stringify(this.stateApiPar) !== JSON.stringify(apiParams) ||
            reset
        ) {
            this.stateApiPar = { ...apiParams };
            this.getToken();

            this.httpOptions["params"] = new HttpParams({
                fromObject: apiParams,
            });
            this.stateDataRoleLazy$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}tblRole`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }

        return this.stateDataRoleLazy$;
    }

    postDataRole(data: any) {
        this.getToken();
        return this.http.post<any>(
            `${environment.appBackendUrl}tblRole`,
            data,
            this.httpOptions
        );
    }

    putDataRole(id: string, data: any) {
        this.getToken();
        return this.http.put<any>(
            `${environment.appBackendUrl}tblRole/${id}`,
            data,
            this.httpOptions
        );
    }

    delDataRole(id: string) {
        this.getToken();
        return this.http.delete<any>(
            `${environment.appBackendUrl}tblRole/${id}`,
            this.httpOptions
        );
    }

    // getDatas() {
    //     this.getToken();
    //     return this.http
    //         .get<any[]>(`${environment.appBackendRole}url`, this.httpOptions)
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
    //         .post(`${environment.appBackendRole}url`, data, this.httpOptions)
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
    //         `${environment.appBackendRole}url/${data.GroupId}`,
    //         data,
    //         this.httpOptions
    //     );
    // }

    // deleteData(id: number) {
    //     this.getToken();
    //     return this.http
    //         .delete(
    //             `${environment.appBackendRole}url/${id}`,
    //             this.httpOptions
    //         )
    //         .pipe(map((content) => content["data"]));
    // }

    // public stateDataRole$: Observable<any>;
    // readRole(reset = false) {
    //     if (!this.stateDataRole$ || reset) {
    //         this.getToken();
    //         this.stateDataRole$ = this.http.get<any>(
    //             `${environment.appBackendRole}url`,
    //             this.httpOptions
    //         );
    //     }

    //     return this.stateDataRole$;
    // }
}
