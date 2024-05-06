import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { JwtHelperService } from "@auth0/angular-jwt";
import { BehaviorSubject, Observable } from "rxjs";
import { shareReplay } from "rxjs/operators";
import { UsersService } from "./users.service";
const CACHE_SIZE = 1;
@Injectable({
    providedIn: "root",
})
export class UsersStoreService {
    // constructor(private usersService: UsersService) {
    //     this.fetchAll();
    // }
    // private readonly _datas = new BehaviorSubject<any[]>([]);
    // readonly datas$ = this._datas.asObservable();
    // get datas(): any[] {
    //     return this._datas.getValue();
    // }
    // set datas(val: any[]) {
    //     this._datas.next(val);
    // }
    // async fetchAll() {
    //     this.datas = await this.usersService.readByAllLazy().toPromise();
    // }
}
