import { DatePipe, formatDate } from "@angular/common";
import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostListener,
    LOCALE_ID,
    OnInit,
    ViewChild,
} from "@angular/core";
import {
    ConfirmationService,
    LazyLoadEvent,
    MenuItem,
    MessageService,
    SelectItem,
} from "primeng/api";
import { Dialog } from "primeng/dialog";
import { AppBreadcrumbService } from "src/app/app.breadcrumb.service";
import { UsersService } from "src/app/Services/users.service";
import { environment } from "src/environments/environment";
import { NavigationExtras, Router } from "@angular/router";
import { AutoComplete } from "primeng/autocomplete";
import { GroupsStoreService } from "src/app/Services/groups-store.service";
import { DataMasterService } from "src/app/Services/data_master.service";
import { base64ToFile, ImageCroppedEvent } from "ngx-image-cropper";

@Component({
    selector: "app-master-users",
    templateUrl: "./users.component.html",
    styleUrls: ["./users.component.scss"],
    providers: [
        MessageService,
        ConfirmationService,
        DatePipe,
        { provide: LOCALE_ID, useValue: "id-ID" },
    ],
})
export class UsersComponent implements OnInit {
    ///CUSTOM
    modulTitle: string = "Setting";
    pageTitlePrefix: string = "Daftar";
    pageTitle: string = "Pengguna Aplikasi";
    routerLink: any[] = ["users"];

    @ViewChild("dt") dt: any;
    @ViewChild("avatarimg") avatarimg: ElementRef;
    @HostListener("window:popstate", ["$event"])
    onPopState(event) {
        this.dialogImg = false;
        this.showDialog = false;
    }

    constructor(
        private messageService: MessageService,
        public datepipe: DatePipe,
        private breadcrumbService: AppBreadcrumbService,
        private confirmationService: ConfirmationService,
        private ref: ChangeDetectorRef,
        private router: Router,
        public UsersService: UsersService,
        private dataMasterService: DataMasterService,
        public groupsStoreService: GroupsStoreService
    ) {
        this.breadcrumbService.setItems([
            {
                label: this.modulTitle,
            },
            {
                label: this.pageTitle,
                routerLink: this.routerLink,
            },
        ]);
    }

    isLoading: boolean;
    isLoadingDt: boolean;
    isLoadingPut: boolean;
    isMobile: boolean = window.innerWidth <= 640;
    showDialog: boolean;
    searchQuery: any;
    statEditAdd: any;
    validateForm: boolean = false;
    indonesianDate: any;
    submitted: boolean;

    //#region Data Var
    datas: any;
    data: any;
    length: number;
    totalRecords: number;
    selectedDatas: any[];

    tempGroupChange: any;
    tempPegawaiChange: any;
    empWapuChange: any;
    tempImgChange: string;
    optPegawai: any[];
    optPegawaiSelected: any;
    optWapu: any[];
    optWapuSelected: any;
    initFields: any = {};
    optGroupsSelected: any = {};
    addEditFields: any = {};
    //#endregion

    ////IMG
    avatar: string;
    imageChangedEvent: any = null;
    croppedImage: any = null;
    dialogImg: boolean;
    fileChangeEvent(event: any, id: string): void {
        this.tempImgChange = id;
        this.imageChangedEvent = event;
        this.dialogImg = true;
    }
    imageCroppedAdd(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
        this.addEditFields.avatar = event.base64;
    }
    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
        let index = this.datas.findIndex((data: any) => {
            return data.userid === this.tempImgChange;
        });
        this.datas[index]["avatar"] = event.base64;
    }
    loadImageFailed() {
        this.dialogImg = false;
    }
    upload() {
        this.dialogImg = false;
    }
    /////////////////////////

    //#region DROPDOWN Var
    onGroupChange(group_id: number) {
        this.groupsStoreService.filterById(group_id);
        this.groupsStoreService.datasById$.subscribe(
            (data) => (this.tempGroupChange = data)
        );
    }
    getDropdownPegawai() {
        this.dataMasterService.getPegawai("", 200).subscribe((res) => {
            this.optPegawai = res["data"];
        });
    }
    onPegawaiChange(id, userid) {
        let index = this.datas.findIndex((data: any) => {
            return data.userid == userid;
        });
        this.datas[index]["selected_pegawai"] = this.optPegawai.find(
            (data: any) => {
                return data.NIP.replace(/\s/g, null) == id.replace(/\s/g, null);
            }
        );
        // this.datas[index]["pegawai_nip"] =
        //     this.datas[index]["selected_pegawai"]["NIP"];
    }

    getDropdownWapu() {
        this.dataMasterService.getWapu3("", 200).subscribe((res) => {
            this.optWapu = res["data"];
        });
    }
    onWapuChange(id, userid) {
        let index = this.datas.findIndex((data: any) => {
            return data.userid == userid;
        });
        this.datas[index]["selected_wapu"] = this.optWapu.find(
            (data: any) => {
                return data.WapuID.replace(/\s/g, null) == id.replace(/\s/g, null);
            }
        );
    }
    //#endregion

    ngOnInit() {
        this.isLoading = true;
        this.tempGroupChange = this.groupsStoreService.datasById$.subscribe(
            (data) => data
        );
        this.getDropdownPegawai();
        this.getDropdownWapu();
        this.isLoading = false;
        this.isLoadingDt = true;
    }

    ngOnDestroy() {
        if (window.history.state.modal) {
            history.back();
        }
    }

    //#region DIALOG ADD / EDIT
    addEditDialog(dataRow: any) {
        const modalState = {
            modal: true,
        };
        history.pushState(modalState, null);
        this.statEditAdd = "add";
        if (dataRow) this.addEditFields = { ...dataRow };
        else
            this.addEditFields = {
                userid: null,
                name: null,
                password: null,
                email: null,
                phone: null,
                groupid: null,
                wapuid: null,
                groupcode: null,
                pegawaiid: null,
                avatar: null,
            };
        this.submitted = false;
        this.showDialog = true;
    }
    hideDialog() {
        history.back();
        this.showDialog = false;
        this.submitted = false;
        this.addEditFields = {};
    }
    //#region

    //#region READ
    loadDataLazy(params: any, reset: boolean = false) {
        // console.log(params);
        if (params?.filters?.filter_group) {
            this.optGroupsSelected = params.filters.filter_group.value;
        }

        this.UsersService.readByAllLazy(params, reset).subscribe((data) => {
            this.datas = data["data"];
            this.totalRecords = data["records_total"];
            this.isLoadingDt = false;
        });
    }
    //#endregion

    //#region CREATE
    postData() {
        this.submitted = true;
        if (this.validate()) {
            this.submitted = false;
            this.isLoading = true;
            // console.log(this.addEditFields);
            if (this.addEditFields.avatar) {
                this.addEditFields.avatar = base64ToFile(
                    this.addEditFields.avatar
                );
            }
            this.UsersService.postNewData(this.addEditFields).subscribe(
                (resp) => {
                    this.messageService.add({
                        severity: "success",
                        summary: "Berhasil",
                        detail: `Pengguna baru berhasil ditambahkan.`,
                        life: 3000,
                    });
                    // this.dt.reset();
                    this.loadDataLazy(null, true);
                    this.isLoading = false;
                    this.showDialog = false;
                    // this.loadDataLazy(null, true);
                },
                (error) => {
                    this.messageService.add({
                        severity: "error",
                        summary: "Gagal",
                        detail: `Pengguna baru gagal ditambahkan.`,
                        life: 3000,
                    });
                    this.isLoading = false;
                }
            );
            this.showDialog = false;
            this.isLoading = false;
        }
    }
    //#endregion

    //#region UPDATE
    putData(data: any) {
        // console.log(data);
        const id = data["id"];
        this.submitted = true;
        //     this.submitted = false;
        this.isLoadingPut = true;
        if (data["avatar"]) {
            data["avatar"] = base64ToFile(data["avatar"]);
        }
        this.UsersService.putData(data).subscribe(
            (resp) => {
                this.messageService.add({
                    severity: "success",
                    summary: "Berhasil",
                    detail: `Data berhasil Diubah.`,
                    life: 3000,
                });
                if (data["code_group"]) {
                    const curIndex = this.datas.findIndex((data: any) => {
                        return data.userid == id;
                    });
                    this.datas[curIndex]["group_name"] =
                        this.tempGroupChange["nama_group"];
                    this.datas[curIndex]["group_id"] =
                        this.tempGroupChange["GroupId"];
                } else if (data["pegawai_id"]) {
                    const curIndex = this.datas.findIndex((data: any) => {
                        return data.userid == id;
                    });
                    this.datas[curIndex]["pegawai_nama"] =
                        this.datas[curIndex]["selected_pegawai"]["Nama"];
                    this.datas[curIndex]["pegawai_nip"] =
                        this.datas[curIndex]["selected_pegawai"]["NIP"];
                }
                else if (data["wapu_id"]) {
                    const curIndex = this.datas.findIndex((data: any) => {
                        return data.userid == id;
                    });
                    this.datas[curIndex]["wapu_nama"] =
                        this.datas[curIndex]["selected_wapu"]["NamaBadan"];
                    this.datas[curIndex]["wapu_id"] =
                        this.datas[curIndex]["selected_wapu"]["WapuID"];
                }
                this.isLoadingPut = false;
            },
            (error) => {
                this.messageService.add({
                    severity: "error",
                    summary: "Gagal",
                    detail: `Data gagal Diubah.`,
                    life: 3000,
                });
                this.isLoadingPut = false;
            }
        );

        this.isLoadingPut = false;
    }
    //#endregion

    //#region DELETE
    deleteData(rowData: any) {
        // console.log(rowData);
        this.confirmationService.confirm({
            message:
                "Apakah anda yakin akan menghapus data pengguna " +
                rowData["name"] +
                "?",
            header: "Hapus Data",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Ya",
            rejectLabel: "Batal",
            accept: () => {
                this.UsersService.deleteData(rowData["userid"]).subscribe(
                    (resp) => {
                        this.isLoading = false;
                        this.messageService.add({
                            severity: "success",
                            summary: "Berhasil Menghapus",
                            detail: `Data pengguna berhasil dihapus`,
                            life: 3000,
                        });
                        this.loadDataLazy(null, true);
                    },
                    (error) => {
                        this.isLoading = false;
                        this.messageService.add({
                            severity: "error",
                            summary: "Gagal Menghapus",
                            detail: `Data pengguna gagal dihapus`,
                            life: 3000,
                        });
                    }
                );
            },
        });
    }
    //#endregion

    //#region HELPER

    validate() {
        // console.log(this.addEditFields);
        let validate = false;
        validate =
            this.addEditFields.userid &&
            this.addEditFields.name &&
            this.addEditFields.password &&
            this.addEditFields.email &&
            this.addEditFields.groupid;
        this.validateForm = validate;
        return validate;
    }

    formatRupiah = (money) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(money);
    };

    showDialogMaximized(event, dialog: Dialog) {
        if (window.innerWidth < 960) {
            dialog.maximized = false;
            dialog.maximize();
        }
    }
    //#endregion
}
