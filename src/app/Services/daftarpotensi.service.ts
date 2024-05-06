import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { JwtHelperService } from "@auth0/angular-jwt";
import { BehaviorSubject, Observable } from "rxjs";
// import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
const CACHE_SIZE = 1;
@Injectable({
    providedIn: "root",
})
export class DaftarPotensiService {
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
    private readonly _refresh = new BehaviorSubject<boolean>(false);
    readonly refresh$ = this._refresh.asObservable();

    get datas(): any[] {
        return this._datas.getValue();
    }

    set datas(val: any[]) {
        this._datas.next(val);
    }
    get refresh(): boolean {
        return this._refresh.getValue();
    }

    set refresh(val: boolean) {
        this._refresh.next(val);
    }

    public stateDaftarPotensi$: Observable<any>;
    public stateLastApiParams: any;
    readByAllLazy(event: any, reset = false) {
        let apiParams = {};
        if (event) {
            apiParams = {
                page: ((event.first + event.rows) / event.rows).toString(),
                length: event.rows.toString(),
                search: event.globalFilter,
                sort: event.sortField,
                sort_dir: event.sortOrder === -1 ? "desc" : null,
                filter_upt: event.filters["filter_upt"]
                    ? event.filters["filter_upt"]["value"]["Kode"]
                    : null,
                nonwp: event.filters["nonwp"]
                    ? event.filters["nonwp"]["value"]["checked"].toString()
                    : null,
            };
            Object.entries(apiParams).forEach((o) =>
                o[1] === null || o[1] === undefined || o[1] === "false"
                    ? delete apiParams[o[0]]
                    : 0
            );
        }
        if (
            !this.stateDaftarPotensi$ ||
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
            this.stateDaftarPotensi$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}DaftPotensi`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
            this.refresh = false;
        }
        return this.stateDaftarPotensi$;
    }

    getEditPotensiDtl(id) {
        this.getToken();
        return this.http.get<any>(
            `${environment.appBackendUrl}DaftPotensiDtlall3/${id}`,
            this.httpOptions
        );
    }

    readById(HeaderID: number) {
        this.getToken();
        return this.http
            .get<any>(`${environment.appBackendUrl}Setoran5/${HeaderID}`)
            .toPromise();
    }

    postNewData(data: any) {
        this.getToken();
        this.httpOptions["params"] = new HttpParams();
        return this.http.post(
            `${environment.appBackendUrl}AddSetoran`,
            data,
            this.httpOptions
        );
    }

    postNewDataDetail2(data: any) {
        this.getToken();
        this.httpOptions["params"] = new HttpParams();
        return this.http.post(
            `${environment.appBackendUrl}DaftPotensiDtl`,
            data,
            this.httpOptions
        );
    }

    // putData(data: any, HeaderID: number) {
    //     this.getToken();
    //     this.httpOptions["params"] = new HttpParams();
    //     return this.http.put(
    //         `${environment.appBackendUrl}DaftPotensiDtl/${HeaderID}`,
    //         data,
    //         this.httpOptions
    //     );
    // }

    public stateSkpLookup$: Observable<any>;
    getSKPLookup(reset = false) {
        if (!this.stateSkpLookup$ || reset) {
            this.getToken();
            this.stateSkpLookup$ = this.http
                .get<any>(
                    `${environment.appBackendUrl}Setoran6`,
                    this.httpOptions
                )
                .pipe(shareReplay(CACHE_SIZE));
        }
        return this.stateSkpLookup$;
    }

    //////DETAIL1
    readByAllDetail(PotID: number, reset = false) {
        this.getToken();
        return this.http.get<any>(
            `${environment.appBackendUrl}Potensi4/${PotID}`,
            this.httpOptions
        );
    }

    postNewDataDetail(data: any) {
        this.getToken();
        this.httpOptions["params"] = new HttpParams();
        return this.http.post(
            `${environment.appBackendUrl}AddSetoran`,
            data,
            this.httpOptions
        );
    }

    updateByAllDetail(id: number, data: any) {
        var formData = new FormData();
        Object.keys(data).forEach((key) => formData.append(key, data[key]));

        return this.http.put(
            `${environment.appBackendUrl}DaftPotensiDtl/${id}`,
            formData,
            this.httpOptions
        );
    }

    async editData(data: any, serverUpdate = true) {
        if (data) {
            const dataIndex = this.datas.findIndex(
                (t) => t.DetailID === data.DetailID
            );
            const dataBackup = this.datas.find(
                (t) => t.DetailID === data.DetailID
            );
            this.datas[dataIndex] = { ...data };
            this.datas = [...this.datas];

            if (serverUpdate) {
                try {
                    await this.putData(data).toPromise();
                    return data;
                } catch (e) {
                    this.datas = [...this.datas, dataBackup];
                    return null;
                }
            }
        }
    }

    putData(data: any) {
        this.getToken();
        Object.entries(data).forEach((o) =>
            o[1] === null || o[1] === undefined || o[1] === ""
                ? delete data[o[0]]
                : 0
        );
        this.httpOptions["params"] = new HttpParams();
        console.log(data);
        return this.http.put(
            `${environment.appBackendUrl}DaftPotensiDtl/${data.DetailID}`,
            data,
            this.httpOptions
        );
    }

    async addData(data: any) {
        if (data) {
            console.log("OK");

            // const tmpId = 999999999;
            let tmpData = { ...data };
            // tmpData["DetailID"] = tmpId;

            this.datas = [tmpData, ...this.datas];
            try {
                const dataPost = await this.postMultipleData(data).toPromise();
                // const index = this.datas.indexOf(
                //     this.datas.find((t) => t.DetailID === tmpId)
                // );
                // // this.datas[index] = {...dataPost,};
                // this.datas[index]["DetailID"] = dataPost["id"];
                this.datas = [...this.datas];
                return this.datas;
            } catch (e) {
                console.error(e);
                // this.removeData(tmpId, false);
                return null;
            }
        }
    }

    postMultipleData(data: any) {
        this.getToken();
        this.httpOptions["params"] = new HttpParams();
        return this.http
            .post(
                `${environment.appBackendUrl}DaftPotensiDtl`,
                data,
                this.httpOptions
            )
            .pipe(map((content) => content["data"]));
    }

    postData(data: any) {
        this.getToken();
        Object.entries(data).forEach((o) =>
            o[1] === null || o[1] === undefined || o[1] === ""
                ? delete data[o[0]]
                : 0
        );
        this.httpOptions["params"] = new HttpParams();
        return this.http
            .post(
                `${environment.appBackendUrl}DaftPotensiDtl`,
                data,
                this.httpOptions
            )
            .pipe(map((content) => content["data"]));
    }

    async removeData(id: number, serverRemove = true) {
        const data = this.datas.find((t) => t.DetailID === id);
        this.datas = this.datas.filter((d) => d.DetailID !== id);

        if (serverRemove) {
            try {
                await this.deleteData(id).toPromise();
                return id;
            } catch (e) {
                console.error(e);
                this.datas = [...this.datas, data];
                return null;
            }
        }
    }

    deleteData(id: number) {
        this.getToken();
        return this.http
            .delete(
                `${environment.appBackendUrl}DaftPotensiDtl/${id}`,
                this.httpOptions
            )
            .pipe(map((content) => content["data"]));
    }

    //////DETAIL2
    readByAllDetail2(HeaderID: number, reset = false) {
        this.getToken();
        return this.http.get<any>(
            `${environment.appBackendUrl}Setoran7/${HeaderID}`,
            this.httpOptions
        );
    }
}
