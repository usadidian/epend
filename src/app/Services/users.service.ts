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
export class UsersService {
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
            const dataIndex = this.datas.findIndex((t) => t.userid === data.id);
            if (dataIndex != -1) {
                if (data.type === "avatar_upload_start") {
                    this.datas[dataIndex].avatar =
                        "assets/layout/images/uploading.gif";
                    this.datas = [...this.datas];
                } else {
                    const genId = +new Date();
                    this.datas[dataIndex].avatar = `${data.avatar}?${genId}`;
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
                search: event.globalFilter,
                sort: event.sortField,
                sort_dir: event.sortOrder === -1 ? "desc" : null,
                code_group: event.filters["filter_group"]
                    ? event.filters["filter_group"].value.code_group
                    : null,
            };
            Object.entries(apiParams).forEach((o) =>
                o[1] === null || o[1] === undefined || o[1] === "false"
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
                .get<any>(`${environment.appBackendUrl}users`, this.httpOptions)
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
            `${environment.appBackendUrl}users`,
            formData,
            this.httpOptions
        );
    }

    putData(data: any) {
        this.getToken();
        var formData = new FormData();
        // formData.append("avatar", data.avatar);
        Object.keys(data).forEach((key) => formData.append(key, data[key]));
        this.httpOptions["params"] = new HttpParams();
        return this.http.put(
            `${environment.appBackendUrl}users/${data.id}`,
            formData,
            this.httpOptions
        );
    }

    deleteData(id: number) {
        this.getToken();
        return this.http.delete(
            `${environment.appBackendUrl}users/${id}`,
            this.httpOptions
        );
    }

    //////DETAIL1
    readByAllDetail(HeaderID: number, reset = false) {
        this.getToken();
        return this.http.get<any>(
            `${environment.appBackendUrl}Setoran4/${HeaderID}`,
            this.httpOptions
        );
    }

    MyProfileRead() {
        this.getToken();
        this.httpOptions["params"] = new HttpParams();
        return this.http.get(
            `${environment.appBackendUrl}my_profile`,
            this.httpOptions
        );
    }

    MyProfilePut(data: any) {
        this.getToken();
        Object.entries(data).forEach((o) =>
            o[1] === null || o[1] === undefined || o[1] === ""
                ? delete data[o[0]]
                : 0
        );
        var formData = new FormData();
        // formData.append("avatar", data.avatar);
        Object.keys(data).forEach((key) => formData.append(key, data[key]));
        this.httpOptions["params"] = new HttpParams();
        return this.http.put(
            `${environment.appBackendUrl}my_profile`,
            formData,
            this.httpOptions
        );
    }

    ChangePassword(oldPwd: string, newPwd: string) {
        this.getToken();
        this.httpOptions["params"] = new HttpParams();
        return this.http.post(
            `${environment.appBackendUrl}change-pwd`,
            { "old-pwd": oldPwd, "new-pwd": newPwd },
            this.httpOptions
        );
    }

    private readonly _usersOnline = new BehaviorSubject<any[]>([]);
    readonly usersOnline$ = this._usersOnline.asObservable();

    get usersOnline(): any[] {
        return this._usersOnline.getValue();
    }

    set usersOnline(val: any[]) {
        this._usersOnline.next(val);
    }

    async fetchUsersOnline(reset = false) {
        this.usersOnline = await this.getUsersOnline(reset).toPromise();
    }

    getUsersOnline(reset = false) {
        this.getToken();
        return this.http
            .get<any[]>(
                `${environment.appBackendUrl}users_online`,
                this.httpOptions
            )
            .pipe(map((content) => content["data"]));
        // if (!this.usersOnline$ ||reset) {
        // this.usersOnline = await this.http
        //     .get<any[]>(`${environment.appBackendUrl}users_online`,this.httpOptions)
        //     .pipe(map((content) => content["data"]))
        //     .toPromise();
        // }
        // return this.usersOnline$;
    }

    // CHAT BOX STATUS
    private readonly _chatBoxActive = new BehaviorSubject<Boolean>(false);
    readonly chatBoxActive$ = this._chatBoxActive.asObservable();
    get chatBoxActive(): Boolean {
        return this._chatBoxActive.getValue();
    }

    set chatBoxActive(val: Boolean) {
        this._chatBoxActive.next(val);
    }

    toggleChatBox() {
        this.chatBoxActive = !this.chatBoxActive;
    }

    private readonly _chatMessageCurrentUser = new BehaviorSubject<any[]>([]);
    readonly chatMessageCurrentUser$ =
        this._chatMessageCurrentUser.asObservable();
    get chatMessageCurrentUser(): any[] {
        return this._chatMessageCurrentUser.getValue();
    }

    set chatMessageCurrentUser(val: any[]) {
        this._chatMessageCurrentUser.next(val);
    }

    setChatMessageCurrentUser(data: any) {
        this.chatMessageCurrentUser = data;
    }

    private readonly _chatMessageCurrent = new BehaviorSubject<any[]>([]);
    readonly chatMessageCurrent$ = this._chatMessageCurrent.asObservable();
    private readonly _chatMessageCurrentGroup = new BehaviorSubject<any[]>([]);
    readonly chatMessageCurrentGroup$ =
        this._chatMessageCurrentGroup.asObservable();

    get chatMessageCurrent(): any[] {
        return this._chatMessageCurrent.getValue();
    }

    set chatMessageCurrent(val: any[]) {
        this._chatMessageCurrent.next(val);
    }

    get chatMessageCurrentGroup(): any[] {
        return this._chatMessageCurrentGroup.getValue();
    }

    set chatMessageCurrentGroup(val: any[]) {
        this._chatMessageCurrentGroup.next(val);
    }

    grouping() {
        let data = new Set(
            this.chatMessageCurrent.map((item) =>
                formatDate(item.createdAt, "dd MMM yyyy", "id-ID")
            )
        );
        let result = [];
        data.forEach((date) => {
            result.push({
                date: date,
                data: this.chatMessageCurrent.filter(
                    (i) =>
                        formatDate(i.createdAt, "dd MMM yyyy", "id-ID") === date
                ),
            });
        });
        // console.log(result);
        this.chatMessageCurrentGroup = result;
    }
    async fetchChatMessageCurrent(email: string) {
        this.chatMessageCurrent = await this.getChatMessages(email).toPromise();
        this.grouping();
        // console.log(result);
    }

    getChatMessages(email: string) {
        this.getToken();
        return this.http
            .get<any[]>(
                `${environment.appBackendUrl}users_chat/${email}`,
                this.httpOptions
            )
            .pipe(map((content) => content["data"]));
    }

    async postChatMessage(data: any, message: string) {
        this.getToken();
        // this.httpOptions["params"] = new HttpParams();
        const dataPost = await this.http
            .post(
                `${environment.appBackendUrl}users_chat/${data.email}`,
                { message: message },
                this.httpOptions
            )
            .toPromise();
        // let newData = {
        //     avatar: data.avatar,
        //     chatId: dataPost["data"]["id"],
        //     createdAt: new Date(),
        //     deliveryAt: null,
        //     description: message,
        //     email: data.email,
        //     isMine: true,
        //     name: data.name,
        //     readAt: null,
        // };
        this.chatMessageCurrent = [
            ...this.chatMessageCurrent,
            dataPost["data"],
        ];
        this.grouping();
    }

    async postChatMessageFromNotif(data: any) {
        data["isMine"] = Boolean(JSON.parse(data["isMine"]));
        // console.log(data["isMine"]);
        this.chatMessageCurrent = [...this.chatMessageCurrent, data];
        this.grouping();
    }

    setReadMessage(resp: any) {
        // console.log(resp);
        let data = [];
        try {
            data = JSON.parse(resp);
        } catch (e) {
            data = resp;
        }

        data.forEach((element) => {
            // console.log(element.chatId);
            const index = this.chatMessageCurrent.indexOf(
                this.chatMessageCurrent.find((t) => t.chatId === element.chatId)
            );
            if (this.chatMessageCurrent[index]) {
                this.chatMessageCurrent[index].readAt = element.readAt;
            }
        });
    }

    async postReadMessage(id: number) {
        // console.log(id);
        const dataPost = await this.http
            .post(
                `${environment.appBackendUrl}users_chat_read/${id}`,
                {
                    readAt: formatDate(
                        new Date(),
                        "yyyy-MM-dd HH:mm:ss",
                        "en-US"
                    ),
                },
                this.httpOptions
            )
            .toPromise();
    }
}
