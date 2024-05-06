import { DatePipe } from "@angular/common";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostListener,
    LOCALE_ID,
    OnInit,
    ViewChild,
} from "@angular/core";
import { ConfirmationService, MessageService } from "primeng/api";
import { Dialog } from "primeng/dialog";
import { AppBreadcrumbService } from "src/app/app.breadcrumb.service";
import { GroupsStoreService } from "src/app/Services/groups-store.service";
import { DataMasterService } from "src/app/Services/data_master.service";

@Component({
    selector: "app-master-groups",
    templateUrl: "./groups.component.html",
    styleUrls: ["./groups.component.scss"],
    providers: [
        MessageService,
        ConfirmationService,
        DatePipe,
        { provide: LOCALE_ID, useValue: "id-ID" },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupsComponent implements OnInit {
    ///CUSTOM
    modulTitle: string = "Setting";
    pageTitlePrefix: string = "Daftar";
    pageTitle: string = "Grup Pengguna";
    routerLink: any[] = ["groups"];

    @ViewChild("dt") dt: any;
    @ViewChild("avatarimg") avatarimg: ElementRef;
    @HostListener("window:popstate", ["$event"])
    onPopState(event) {
        this.showDialog = false;
    }

    datasTrackFn = (i, data) => data.GroupId;

    constructor(
        private messageService: MessageService,
        public datepipe: DatePipe,
        private breadcrumbService: AppBreadcrumbService,
        private confirmationService: ConfirmationService,
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
    isMobile: boolean = window.innerWidth <= 640;
    showDialog: boolean;
    searchQuery: any;
    statEditAdd: any;
    validateForm: boolean = false;
    submitted: boolean;

    //#region Data Var
    datas: any;
    addEditFields: any = {};

    ///dropdown
    tempGroupChange: any;
    tempPegawaiChange: any;
    tempImgChange: string;
    optPegawai: any[];
    optPegawaiSelected: any;
    initFields: any = {};
    optGroupsSelected: any = {};
    //#endregion

    ngOnInit() {}

    ngOnDestroy() {
        if (window.history.state.modal) {
            history.back();
        }
    }

    //#region DROPDOWN CHANGES
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
    }
    //#endregion

    //#region DIALOG ADD / EDIT
    addEditDialog(dataRow: any) {
        const modalState = {
            modal: true,
        };
        history.pushState(modalState, null);

        if (dataRow) {
            this.statEditAdd = "edit";
            this.addEditFields = { ...dataRow };
        } else {
            this.statEditAdd = "add";
            this.addEditFields = {
                nama_group: null,
                description: null,
                level_group: "60",
                IsAdmin: null,
                IsWP: null,
                IsPendaftaran: null,
                IsPendataan: null,
                code_group: null,
                UserUpd: null,
                DateUpd: null,
            };
        }

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

    //#region CREATE-UPDATE
    postPutData() {
        this.submitted = true;
        if (this.validate()) {
            this.submitted = false;
            this.isLoading = true;
            if (this.statEditAdd === "add") {
                this.groupsStoreService.addData(this.addEditFields).then(
                    (res) => {
                        this.messageService.add({
                            severity: "success",
                            summary: "Berhasil",
                            detail: `Grup baru berhasil ditambahkan.`,
                        });
                        this.isLoading = false;
                        this.showDialog = false;
                    },
                    (error) => {
                        this.messageService.add({
                            severity: "error",
                            summary: "Gagal",
                            detail: `Data gagal ditambahkan.`,
                        });
                        this.isLoading = false;
                    }
                );
            } else {
                this.groupsStoreService.editData(this.addEditFields).then(
                    (res) => {
                        this.messageService.add({
                            severity: "success",
                            summary: "Berhasil",
                            detail: `Data berhasil diubah.`,
                        });
                        this.showDialog = false;
                        this.isLoading = false;
                    },
                    (error) => {
                        this.messageService.add({
                            severity: "error",
                            summary: "Gagal",
                            detail: `Data gagal diubah.`,
                        });
                        this.isLoading = false;
                    }
                );
            }
        }
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
                this.groupsStoreService
                    .removeData(rowData.GroupId)
                    .then((res) => {
                        if (res) {
                            this.isLoading = false;
                            this.messageService.add({
                                severity: "success",
                                summary: "Berhasil Menghapus",
                                detail: `Data grup berhasil dihapus`,
                            });
                        } else {
                            this.isLoading = false;
                            this.messageService.add({
                                severity: "error",
                                summary: "Gagal Menghapus",
                                detail: `Data grup gagal dihapus`,
                            });
                        }
                    });
            },
        });
    }
    //#endregion

    //#region HELPER

    validate() {
        // console.log(this.addEditFields);
        let validate = false;
        validate =
            this.addEditFields.nama_group && this.addEditFields.code_group;
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
