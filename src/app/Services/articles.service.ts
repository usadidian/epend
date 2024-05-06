import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { JwtHelperService } from "@auth0/angular-jwt";
import { BehaviorSubject, Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { formatDate } from "@angular/common";
const CACHE_SIZE = 1;
@Injectable({
    providedIn: "root",
})
export class ArticlesService {
    httpOptions: any;

    constructor(private http: HttpClient) {}

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

    private readonly _datas = new BehaviorSubject<any[]>([]);
    readonly datas$ = this._datas.asObservable();

    private readonly _totalRecords = new BehaviorSubject<number>(0);
    readonly totalRecords$ = this._totalRecords.asObservable();

    get datas(): any[] {
        return this._datas.getValue();
    }

    set datas(val: any[]) {
        this._datas.next(val);
    }

    get totalRecords(): number {
        return this._totalRecords.getValue();
    }

    set totalRecords(val: number) {
        this._totalRecords.next(val);
    }

    async updateAvatar(data: any) {
        if (data) {
            const dataIndex = this.datas.findIndex(
                (t) => `${t.id}` === data.id
            );
            // console.log(data);
            if (dataIndex != -1) {
                if (data.type === "avatar_upload_start") {
                    this.datas[dataIndex].img =
                        "assets/layout/images/uploading.gif";
                    this.datas = [...this.datas];
                } else {
                    const genId = +new Date();
                    this.datas[dataIndex].img = `${data.img}?${genId}`;
                    this.datas = [...this.datas];
                }
            }
        }
    }

    public stateDatas$: Observable<any>;
    public stateLastApiParams: any;
    readByAllLazy(event: any, reset = false) {
        // console.log(reset);
        let apiParams = {};
        if (event) {
            apiParams = {
                page: ((event.first + event.rows) / event.rows).toString(),
                length: event.rows.toString(),
                search: event.filter,
                // sort: event.sortField,
                // sort_dir: event.sortOrder === -1 ? "desc" : null,
                categories: event.categories,
            };
            Object.entries(apiParams).forEach((o) =>
                o[1] === null ||
                o[1] === undefined ||
                o[1] === "false" ||
                o[1] === ""
                    ? delete apiParams[o[0]]
                    : 0
            );
        }

        if (
            !this.stateDatas$ ||
            JSON.stringify(this.stateLastApiParams) !==
                JSON.stringify(apiParams) ||
            reset
        ) {
            this.stateLastApiParams = { ...apiParams };
            this.getToken();
            this.httpOptions["params"] = new HttpParams({
                fromObject: apiParams,
            });
            this.stateDatas$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}article`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }
        this.stateDatas$.subscribe(
            (content) => (
                (this.datas = content["data"]),
                (this.totalRecords = content["records_total"])
            )
        );
        return this.stateDatas$;
    }

    readById(HeaderID: string) {
        this.getToken();
        return this.http
            .get<any>(
                `${environment.appBackendUrl}SuratTeguranHist/${HeaderID}`,
                this.httpOptions
            )
            .toPromise();
    }

    postNewData(data: any) {
        this.getToken();
        Object.entries(data).forEach((o) =>
            o[1] === null || o[1] === undefined || o[1] === ""
                ? delete data[o[0]]
                : 0
        );
        // console.log(data);
        var formData = new FormData();
        Object.keys(data).forEach((key) => formData.append(key, data[key]));
        this.httpOptions["params"] = new HttpParams();
        return this.http.post(
            `${environment.appBackendUrl}article`,
            formData,
            this.httpOptions
        );
    }

    putData(data: any) {
        this.getToken();
        Object.entries(data).forEach((o) =>
            o[1] === null || o[1] === undefined || o[1] === ""
                ? delete data[o[0]]
                : 0
        );
        delete data.created_date;
        delete data.last_updated_date;
        delete data.created_by;
        delete data.last_updated_by;
        var formData = new FormData();
        // formData.append("avatar", data.avatar);
        Object.keys(data).forEach((key) => formData.append(key, data[key]));
        this.httpOptions["params"] = new HttpParams();
        return this.http.put(
            `${environment.appBackendUrl}article/${data.id}`,
            formData,
            this.httpOptions
        );
    }

    deleteData(id: number) {
        this.getToken();
        return this.http.delete(
            `${environment.appBackendUrl}article/${id}`,
            this.httpOptions
        );
    }
}
