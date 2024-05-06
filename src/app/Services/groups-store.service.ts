import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { JwtHelperService } from "@auth0/angular-jwt";
import { BehaviorSubject, Observable } from "rxjs";
import { filter, map, shareReplay } from "rxjs/operators";
import { GroupsService } from "./groups.service";
const CACHE_SIZE = 1;
@Injectable({
    providedIn: "root",
})
export class GroupsStoreService {
    constructor(private groupsService: GroupsService) {
        this.fetchAll();
    }

    private readonly _datas = new BehaviorSubject<any[]>([]);
    readonly datas$ = this._datas.asObservable();

    readonly datasDropdown$ = this.datas$;

    get datas(): any[] {
        return this._datas.getValue();
    }

    set datas(val: any[]) {
        this._datas.next(val);
    }

    async fetchAll() {
        this.datas = await this.groupsService.getDatas().toPromise();
    }

    private readonly _datasById = new BehaviorSubject<any>({});
    readonly datasById$ = this._datasById.asObservable();
    readonly currentId$ = this.datasById$.pipe(
        map((data) => data["code_group"])
    );
    get datasById(): any {
        return this._datasById.getValue();
    }
    set datasById(val: any) {
        this._datasById.next(val);
    }

    filterById(group_id: number) {
        let data = this.datas.find((data) => data["GroupId"] === group_id);
        if (data) {
            this.datasById = { ...data };
        }
    }

    async addData(data: any) {
        if (data) {
            const tmpId = 999999999;
            let tmpData = { ...data };
            tmpData["GroupId"] = tmpId;

            this.datas = [tmpData, ...this.datas];
            try {
                const dataPost = await this.groupsService
                    .postData(data)
                    .toPromise();
                const index = this.datas.indexOf(
                    this.datas.find((t) => t.GroupId === tmpId)
                );
                // this.datas[index] = {...dataPost,};
                this.datas[index]["GroupId"] = dataPost["id"];
                this.datas = [...this.datas];
                return this.datas;
            } catch (e) {
                console.error(e);
                this.removeData(tmpId, false);
                return null;
            }
        }
    }

    async editData(data: any, serverUpdate = true) {
        if (data) {
            const dataIndex = this.datas.findIndex(
                (t) => t.GroupId === data.GroupId
            );
            const dataBackup = this.datas.find(
                (t) => t.GroupId === data.GroupId
            );
            this.datas[dataIndex] = { ...data };
            this.datas = [...this.datas];

            if (serverUpdate) {
                try {
                    await this.groupsService.putData(data).toPromise();
                    return data;
                } catch (e) {
                    this.datas = [...this.datas, dataBackup];
                    return null;
                }
            }
        }
    }

    async removeData(id: number, serverRemove = true) {
        const data = this.datas.find((t) => t.GroupId === id);
        this.datas = this.datas.filter((d) => d.GroupId !== id);

        if (serverRemove) {
            try {
                await this.groupsService.deleteData(id).toPromise();
                return id;
            } catch (e) {
                console.error(e);
                this.datas = [...this.datas, data];
                return null;
            }
        }
    }
}
