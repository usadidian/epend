import {
    DatePipe,
    formatDate,
    Location,
    ViewportScroller,
} from "@angular/common";
import { HostListener, Injectable, Input, LOCALE_ID } from "@angular/core";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
    ConfirmationService,
    LazyLoadEvent,
    MenuItem,
    MessageService,
    SelectItem,
    TreeNode,
    
} from "primeng/api";
import { Dialog } from "primeng/dialog";
import { AppBreadcrumbService } from "src/app/app.breadcrumb.service";
import { environment } from "src/environments/environment";
import { Router, NavigationEnd } from "@angular/router";
import { DataMasterService } from "src/app/Services/data_master.service";
import { DaftarPotensiService } from "src/app/Services/daftarpotensi.service";
import { ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { registerLocaleData } from "@angular/common";
import localeId from "@angular/common/locales/id";
import { TreeviewItem } from "ngx-treeview";
import { Tree } from "primeng/tree";

registerLocaleData(localeId, "id");

@Component({
    selector: "app-daftarpotensi-detail",
    templateUrl: "./daftarpotensi_detail.component.html",
    styleUrls: ["./daftarpotensi_detail.component.scss"],
    providers: [
        MessageService,
        ConfirmationService,
        DatePipe,
        { provide: LOCALE_ID, useValue: "id-ID" },
    ],
})
export class DaftarPotensiDetailComponent implements OnInit {
    showDialog: boolean;
    datas: any[];
    dropdownEnabled = true;
    items: any;
    values: number[];

    constructor(
        private dataMasterService: DataMasterService,
        private daftarpotensiService: DaftarPotensiService,
        private messageService: MessageService,
        public datepipe: DatePipe,
        private breadcrumbService: AppBreadcrumbService,
        private router: Router,
        public route: ActivatedRoute,
        private confirmationService: ConfirmationService,
        private ref: ChangeDetectorRef,
        public location: Location
        
    ) {
        if (this.router.getCurrentNavigation().extras.state) {
            this.dialogState = this.router.getCurrentNavigation()
                ? this.router.getCurrentNavigation().extras.state.dialog
                : null;
        }
        this.breadcrumbService.setItems([
            { label: "DaftarPotensi", routerLink: ["daftarpotensi"] },
            { label: "Detail", routerLink: ["daftarpotensi_det"] },
        ]);
        this.selectedTreeNode = null;
    }

    @ViewChild("dt") dt: any;
    @ViewChild("dt2") dt2: any;
    @HostListener("window:popstate", ["$event"])
    onPopState(event) {
        this.dataDialog = false;
        this.productDialog = false;
        this.showDialog = false;
    }
    environment: any = { ...environment };
    submitted: boolean;
    isLoading: boolean;
    isLoadingDt: boolean;
    editable: boolean = true;
    isLoadingModal: boolean;
    productDialog: boolean;
    isLoadingDt2: boolean;
    currentPotID: string = "";
    currentWPID: string = "";
    currentNamaBadan: string = "";
    dialogState: string;
    products: any;
    product: any = { PotID: null
        ,nested:1 
    };
    rowGroupMetadata: any;
    productsDetail: any;
    productDetail: any;
    initFields: any = {
        DetailID: null,
        PotensiID: null,
        WPID: null,
        PotID: null,
        Jumlah: null,
        PotensiPerTahun: null,
        TglPendataan: null,
        Keterangan: null,
    };
    tempEditFields: any;

    dataDialog: boolean;
    modalTitle: string = "";

    addEditFields: any = {};
    //#endregion
    overlays: any[];
    currentId: number;

    searchQuery: any;
    statEditAdd: any;
    statFormType: any;
    validateForm: boolean = false;
    printMenuModel: MenuItem[];
    indonesian: any;

    //#region DROPDOWN Var
    optFromSKP: boolean = false;
    optJnsPend: any[];
    optJnsPendSelected: any;

    optJnsTarif: SelectItem[];
    optJnsTarifSelected: any;
    optJnsTarifSelectedMulti: any[] = [];

    public data: Tree;
	public selectedTreeNode: TreeNode | null;
    //#endregion

    // dateRange
    id: any;
    selectedNodes: TreeNode[];
    

    ngOnInit() {
        this.currentPotID = sessionStorage.getItem("daftarpotensi_laststs");
        this.currentWPID = sessionStorage.getItem("daftarpotensi_laststst");
        this.currentNamaBadan = sessionStorage.getItem("daftarpotensi_last");
        this.isLoading = true;
        this.currentId = this.route.snapshot.params["header_id"];
        this.id = {
            firstDayOfWeek: 1,
            dayNames: [
                "Minggu",
                "Senin",
                "Selasa",
                "Rabu",
                "Kamis",
                "Jumat",
                "Sabtu",
            ],
            dayNamesShort: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
            dayNamesMin: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
            monthNames: [
                "Januari",
                "Februari",
                "Maret",
                "April",
                "Mei",
                "Juni",
                "Juli",
                "Agustus",
                "September",
                "Oktober",
                "November",
                "Desember",
            ],
            monthNamesShort: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Agu",
                "Sep",
                "Okt",
                "Nov",
                "Des",
            ],
            today: "Hari Ini",
            clear: "Ulang",
        };
        let today = new Date();
        let month = today.getMonth();
        let year = today.getFullYear();
        let prevMonth = month === 0 ? 11 : month - 1;
        let prevYear = prevMonth === 11 ? year - 1 : year;
        let nextMonth = month === 11 ? 0 : month + 1;
        let nextYear = nextMonth === 0 ? year + 1 : year;
        this.isLoading = false;
        this.isLoadingDt = true;
        this.loadData();
        this.updateRowGroupMetaData();
        if (this.dialogState == "add") {
            this.addEditDialog(null);
        }
    }

    /////ID PADA GRID :
    dataRowId: string = "PotensiID";
    /////KOLOM PADA GRID :
    dataCols: any[] = [
        { field: "KdUrut", header: "Kode", sortable: true },
        { field: "JenisPotensi", header: "Jenis Potensi", sortable: true },
        { field: "KdLevel", header: "Level", sortable: true },
        { field: "Satuan", header: "Satuan", sortable: true },
    ];

    ngOnDestroy() {
        if (window.history.state.modal || window.history.state.showdetail) {
            history.back();
        }
    }

    loadData() {
        this.isLoading = false;
        this.isLoadingDt = true;
        this.daftarpotensiService
            .readByAllDetail(this.currentId)
            .subscribe((data) => {
                this.datas = data["data"];
                this.isLoadingDt = false;
                this.updateRowGroupMetaData();
                this.isLoading = false;
            });
    }

    updateRowGroupMetaData() {
        this.rowGroupMetadata = {};
        if (this.products) {
            for (let i = 0; i < this.products.length; i++) {
                let rowData = this.products[i];
                let representativeName = rowData["PotID"];
                if (i == 0) {
                    this.rowGroupMetadata[representativeName] = {
                        index: 0,
                        size: 1,
                    };
                } else {
                    let previousRowData = this.products[i - 1];
                    let previousRowGroup = previousRowData["PotID"];
                    if (representativeName === previousRowGroup)
                        this.rowGroupMetadata[representativeName].size++;
                    else
                        this.rowGroupMetadata[representativeName] = {
                            index: i,
                            size: 1,
                        };
                }
            }
        }
    }

    resetTable() {
        this.searchQuery = "";
        this.loadData();
    }
    //#endregion

    //#region DIALOGUE
    showDialogMaximized(event, dialog: Dialog) {
        if (window.innerWidth < 960) {
            dialog.maximized = false;
            dialog.maximize();
        }
    }

    hideDialog() {
        if (window.history.state.modal) {
            history.back();
        }
        this.productDialog = false;
        this.submitted = false;
        this.addEditFields = {};
        this.product = {};
        this.showDialog = false;
    }

    getDropdownJnsPend(dataRow: any) {
        this.dataMasterService.getJnsPotensi(dataRow, true).subscribe((data) => {
            this.optJnsPend =  data["data"];
            if (!this.optJnsPendSelected) {
                this.optJnsPendSelected = {
                    PotensiID: "",
                };
            }
            // }
        });
    }

    public selectNode( node: TreeNode ) : void {
    
		this.selectedTreeNode = node;
 
    }
    

    clonedProducts: { [s: string]: any } = {};
    onRowEditInit(data: any) {
        this.clonedProducts[data.DetailID] = { ...data };
        this.addEditFields.TglPendaftaran = data["data"].TglPendaftaran
                    ? new Date(data["data"].TglPendaftaran)
                    : null;
    }

    onRowEditSave(data: any) {
        this.postPutDataRow(data);
        delete this.clonedProducts[data.DetailID];
    }

    onRowEditCancel(data: any, index: number) {
        this.datas[index] = this.clonedProducts[data.DetailID];
    }

    disabledDelRow(value: string) {
        let valuearr = value.split(".");
        if (parseInt(valuearr[3]) > 9) {
            return true;
        }
        return false;
    }

    openNew(dataRow: any) {
        this.items =
        this.getDropdownJnsPend({
            PotID: this.currentPotID,
            nested:1
        });
        const modalState = {
            modal: true,
        };
        history.pushState(modalState, null);
        this.product = dataRow;
        this.addEditFields = { ...dataRow };
        this.statEditAdd = "add";
        this.modalTitle = "Detail Daftar Potensi Baru";
        this.statFormType = "";
        this.addEditFields = Object.assign({}, this.initFields);
        this.optJnsTarifSelectedMulti = [];
        
        this.submitted = false;
        this.dataDialog = true;
        this.editable = false;
        this.showDialog = true;
    }

    addEditDialog(dataRow: any) {
        this.optJnsTarifSelectedMulti = [];
        const modalState = {
            modal: true,
        };
        history.pushState(modalState, null);
        this.addEditFields = dataRow;

        if (dataRow) {
            this.statEditAdd = "edit";
            this.getDropdownJnsPend({
                PotID: this.currentPotID,
            });
            this.addEditFields = { ...dataRow };
            this.modalTitle = "Ubah Data Potensi";
            this.validate();
            history.pushState(modalState, null);
        }
        this.submitted = false;
        this.showDialog = true;
        history.pushState(modalState, null);
    }

    postPutData() {
        this.submitted = true;
        this.isLoading = true;
        this.addEditFields.TglPendataan = formatDate(
            this.addEditFields.TglPendataan,
            "yyyy-MM-dd",
            "en-US"
        );
        this.daftarpotensiService
            .addData({
                PotID: this.currentPotID,
                PotensiID: this.optJnsTarifSelectedMulti?.map(
                    (p) => p.PotensiID
                ),
            })
            .then(
                (res) => {
                    console.log(res);
                    this.messageService.add({
                        severity: "success",
                        summary: "Berhasil",
                        detail: `Data berhasil ditambahkan.`,
                    });
                    this.isLoading = false;
                    this.showDialog = false;
                    this.loadData();
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
    }

    postPutDataRow(data: any) {
        this.isLoading = true;
        this.daftarpotensiService.editData(data).then(
            (res) => {
                console.log(res);
                this.messageService.add({
                    severity: "success",
                    summary: "Berhasil",
                    detail: `Data berhasil ditambahkan.`,
                });
                this.isLoading = false;
                this.showDialog = false;
                this.loadData();
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
    }

    deleteData(rowData: any) {
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
                this.daftarpotensiService
                    .removeData(rowData.DetailID)
                    .then((res) => {
                        if (res) {
                            this.isLoading = false;
                            this.messageService.add({
                                severity: "success",
                                summary: "Berhasil Menghapus",
                                detail: `Data grup berhasil dihapus`,
                            });
                            this.loadData();
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

    validate() {
        let validate =
            this.addEditFields.PotensiID &&
            this.addEditFields.Jumlah &&
            this.addEditFields.PotensiPerTahun;

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
    //#endregion
}
