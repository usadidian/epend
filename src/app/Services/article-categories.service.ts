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
export class ArticlesCategoriesService {
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

    getDatas() {
        this.getToken();
        return this.http
            .get<any[]>(
                `${environment.appBackendUrl}article-categories`,
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
                `${environment.appBackendUrl}article-categories`,
                data,
                this.httpOptions
            )
            .pipe(map((content) => content["data"]));
    }

    putData(data: any) {
        this.getToken();
        Object.entries(data).forEach((o) =>
            o[1] === null || o[1] === undefined || o[1] === ""
                ? delete data[o[0]]
                : 0
        );
        this.httpOptions["params"] = new HttpParams();
        return this.http.put(
            `${environment.appBackendUrl}article-categories/${data.GroupId}`,
            data,
            this.httpOptions
        );
    }

    deleteData(id: number) {
        this.getToken();
        return this.http
            .delete(
                `${environment.appBackendUrl}article-categories/${id}`,
                this.httpOptions
            )
            .pipe(map((content) => content["data"]));
    }

    public stateDataGroups$: Observable<any>;
    readGroups(reset = false) {
        if (!this.stateDataGroups$ || reset) {
            this.getToken();
            this.stateDataGroups$ = this.http.get<any>(
                `${environment.appBackendUrl}article-categories`,
                this.httpOptions
            );
        }

        return this.stateDataGroups$;
    }
}
