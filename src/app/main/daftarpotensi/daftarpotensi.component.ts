import { DatePipe, formatDate } from "@angular/common";
import {
    ChangeDetectorRef,
    Component,
    HostListener,
    LOCALE_ID,
    OnInit,
    ViewChild,
} from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import {
    ConfirmationService,
    LazyLoadEvent,
    MessageService,
    SelectItem,
} from "primeng/api";
import { AutoComplete } from "primeng/autocomplete";
import { Dialog } from "primeng/dialog";
import { AppBreadcrumbService } from "src/app/app.breadcrumb.service";
import { DataMasterService } from "src/app/Services/data_master.service";
import { DaftarPotensiService } from "src/app/Services/daftarpotensi.service";
import { environment } from "src/environments/environment";

@Component({
    selector: "app-daftarpotensi",
    templateUrl: "./daftarpotensi.component.html",
    styleUrls: ["./daftarpotensi.component.scss"],
    providers: [
        MessageService,
        ConfirmationService,
        DatePipe,
        { provide: LOCALE_ID, useValue: "id-ID" },
    ],
})
export class DaftarPotensiComponent implements OnInit {
    @ViewChild("dt") dt: any;
    @ViewChild("inputWilayahUpt") inputWilayahUpt: AutoComplete;
    @HostListener("window:popstate", ["$event"])
    onPopState(event) {
        this.dataDialog = false;
    }
    constructor(
        private dataMasterService: DataMasterService,
        private daftarpotensiService: DaftarPotensiService,
        private messageService: MessageService,
        public datepipe: DatePipe,
        private breadcrumbService: AppBreadcrumbService,
        private ref: ChangeDetectorRef,
        private confirmationService: ConfirmationService,
        private router: Router
    ) {
        this.breadcrumbService.setItems([
            { label: "DaftarPotensi", routerLink: ["daftarpotensi"] },
        ]);
    }

    environment: any = { ...environment };
    submitted: boolean;
    isLoading: boolean;
    isLoadingDt: boolean = false;
    isLoadingModal: boolean;
    loadingLookup: boolean;
    isMobile: boolean = window.innerWidth <= 640;
    resetDt: boolean = false;
    reportTypeOpt: any[];
    reportType: string = "pdf";
    reportNameOpt: any[];
    reportName: string = "STS";
    modalTitle: string = "";
    datas: any;
    data: any;
    dataDialog: boolean;
    length: number;
    totalRecords: number;
    selectedDatas: any[];
    cols: any[];
    selectedSkp: any[];
    addEditFields: any = {};
    //#endregion

    searchQuery: any;
    statEditAdd: any = {
        Status: null,
        BadanID: null,
        PotID: null,
        WPID: null,
        TglPendaftaran: null,
        Keterangan: null,
        GrupUsaha: null,
        BendaharaID: null,
        // KodeStatus: null,
    };
    statFormType: any;
    showDetail: boolean = false;
    modalDetTitle = "";
    TarifPajakFormated: string = "";
    validateForm: boolean = false;

    // dateRange
    id: any;

    //#region DROPDOWN Var
    optWilayahUpt: any[];
    optWilayahUptSelected: any;

    optWilayahUptAdd: any[];
    optWilayahUptAddSelected: any;
    optGrupUsaha: any[];
    optGrupUsahaSelected: any;
    optBendahara: any[];
    optBendaharaSelected: any;

    optStatusSetor: any[];
    optStatusSetorSelected: any;

    optFromSKP: boolean = false;

    optTtd: SelectItem[];
    optTtdSelected: SelectItem[];

    optSkpLookup: SelectItem[];
    optSkpLookupSelected: SelectItem[];

    optJnsPend: any[];
    optJnsPendSelected: any;
    //#endregion

    ngAfterContentChecked() {
        this.ref.detectChanges();
    }

    ngOnInit() {
        this.isLoading = true;
        this.getDropdownUpt();

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
        this.reportTypeOpt = [
            {
                label: "pdf",
                value: "pdf",
                icon: "fa fa-file-pdf-o p-pr-2",
                type: "application/pdf",
            },
            {
                label: "excel",
                value: "xls",
                icon: "fa fa-file-excel-o p-pr-2",
                type: "application/vnd.ms-excel",
            },
            {
                label: "csv",
                value: "csv",
                icon: "fa fa-file-code-o p-pr-2",
                type: "application/csv",
            },
        ];

        this.reportNameOpt = [
            {
                label: "STS",
                value: "STS",
            },
            {
                label: "LAMPIRAN",
                value: "STS_LAMP",
            },
        ];
        this.selectedSkp = [{ PotensiID: null, Jumlah: 0 }];
    }

    ngOnDestroy() {
        if (window.history.state.modal || window.history.state.showdetail) {
            history.back();
        }
    }

    //#region DATATABLES
    loadDataLazy(event: LazyLoadEvent, reset = false) {
        this.isLoading = false;
        this.isLoadingDt = true;
        if (this.inputWilayahUpt)
            setTimeout(
                () => this.inputWilayahUpt.inputEL.nativeElement.blur(),
                3
            );

        if (event?.filters?.global) {
            this.searchQuery = event.filters.global.value;
        }

        if (event?.filters?.filter_upt) {
            this.optWilayahUptSelected = event.filters.filter_upt.value;
        }

        this.length = event?.first;

        this.daftarpotensiService
            .readByAllLazy(event, this.resetDt)
            .subscribe((data) => {
                this.datas = data["data"];
                this.totalRecords = data["records_total"];
                this.isLoadingDt = false;
            });
    }

    trackByFunction = (_index, item) => {
        return item.PotID; // O index
    };

    resetTable() {
        this.searchQuery = "";
        this.resetDt = true;
        // this.dt.reset();
        this.loadDataLazy(null, true);
    }
    //#endregion

    //#region DIALOGUE
    showDialogMaximized(_event, dialog: Dialog) {
        if (window.innerWidth < 960) {
            dialog.maximized = false;
            dialog.maximize();
        }
    }

    addDialog() {
        this.optWilayahUptAdd = [...this.optWilayahUpt];
        this.optWilayahUptAddSelected = {
            ...this.optWilayahUptAdd.filter((s) => s.Kode === "0")[0],
        };

        this.addEditFields.BadanID = "0";
        this.addEditFields.GrupUsaha = "2";
        this.addEditFields.Status = "2";
        this.addEditFields.NamaBadan = "-";
        this.addEditFields.Keterangan = "-";
        this.optStatusSetorSelected = null;
        this.addEditFields.PotID = null;
        this.addEditFields.WPID = null;
        this.optFromSKP = false;
        this.optBendaharaSelected = null;
        this.selectedSkp = [{ PotensiID: null, Jumlah: 0 }];
        this.addEditFields.TglPendaftaran = new Date();

        this.statEditAdd = "add";
        this.modalTitle = "Tambah Data DaftarPotensi";
        this.submitted = false;
        const modalState = {
            modal: true,
        };
        history.pushState(modalState, null);
        this.dataDialog = true;
    }

    editDialog(dataRow: any) {
        this.statEditAdd = "edit";
        this.modalTitle = "Ubah Data DaftarPotensi";
        this.isLoadingModal = true;
        this.optWilayahUptAdd = [...this.optWilayahUpt];
        this.daftarpotensiService.readById(dataRow.WPID).then((data) => {
            this.data = data["data"][0];
            this.addEditFields = { ...this.data };

            this.addEditFields.TglPendaftaran = new Date(this.data.TglPendaftaran);
            this.optWilayahUptAdd = [...this.optWilayahUpt];

            const check = this.optWilayahUpt.find(
                (s) => s.BadanID === this.data.BadanID
            );
            if (check) {
                this.optWilayahUptAddSelected = this.optWilayahUpt.filter(
                    (s) => s.BadanID === this.data.BadanID
                )[0];
            } else {
                this.optWilayahUptAdd.unshift({
                    BadanID: this.data.BadanID,
                    UPT: this.data.UPT,
                });
                this.optWilayahUptAddSelected = {
                    BadanID: this.data.BadanID,
                    UPT: this.data.UPT,
                };
            }
            this.selectedSkp = [
                { PotensiID: null, Jumlah: this.data.JmlSetoran },
            ];
            this.addEditFields.GrupUsaha = this.data.KodeSB;
            // this.getDropdownStatus();
            this.getDropdownBendahara();
            this.validate();
            const modalState = {
                modal: true,
            };
            history.pushState(modalState, null);
            this.isLoadingModal = false;
            this.dataDialog = true;
        });
    }

    printDialog(dataRow: any) {
        this.statEditAdd = "print";
        this.isLoadingModal = true;
        this.optWilayahUptAdd = [...this.optWilayahUpt];
        this.daftarpotensiService.readById(dataRow.WPID).then((data) => {
            this.data = data["data"][0];
            this.addEditFields = { ...this.data };
            // console.log(this.addEditFields)
            this.addEditFields.TglPendaftaran = new Date(this.data.TglPendaftaran);
            this.optWilayahUptAdd = [...this.optWilayahUpt];
            this.optWilayahUptAddSelected = this.optWilayahUpt.filter(
                (s) => s.Kode === this.data.BadanID
            )[0];
            this.getDropdownBendahara();
            this.isLoadingModal = false;
            const modalState = {
                modal: true,
            };
            history.pushState(modalState, null);
            this.dataDialog = true;
        });
    }

    hideDialog() {
        history.back();
        this.dataDialog = false;
        this.submitted = false;
        this.data = {};
    }
    //#endregion

    //#region DETAIL PAGE
    showHistory(dataRow: any) {
        this.data = dataRow;
        this.router.navigate([`/admin/daftarpotensi_det/${dataRow.PotID}`]);
        sessionStorage.setItem("daftarpotensi_laststs", dataRow.PotID);
        sessionStorage.setItem("daftarpotensi_laststst", dataRow.WPID);
        sessionStorage.setItem("daftarpotensi_last", dataRow.NamaBadan);
       
    }
    //#endregion

    //#region DROPDOWNS FILL
    getDropdownUpt() {
        this.dataMasterService.getWilayahUpt().subscribe((res) => {
            this.optWilayahUpt = [...res["data"]];
        });
    }

    getDropdownBendahara() {
        this.dataMasterService.getBendahara().subscribe((res) => {
            this.optBendahara = [...res["data"]];
            if (this.statEditAdd === "edit" || this.statEditAdd === "print") {
                this.optBendaharaSelected = this.optBendahara.filter(
                    (s) => s.Kode === this.addEditFields.BendaharaID
                )[0];
            }
        });
    }


    getDropdownTtd(event: any) {
        this.dataMasterService.getPegawai(event.query).subscribe((res) => {
            this.optTtd = res["data"];
        });
    }

    changeOptFromSKP() {
        // console.log(this.optFromSKP);
        if (this.optFromSKP) {
            // this.getDropdownSkp();
            this.selectedSkp = [];
        } else {
            this.selectedSkp = [{ PotensiID: null, Jumlah: 0 }];
        }
    }

    getDropdownSkp() {
        this.loadingLookup = true;
        this.daftarpotensiService.getSKPLookup().subscribe((res) => {
            // console.log(res);
            this.loadingLookup = false;
            this.optSkpLookup = [...res["data"]];
        });
    }

    getDropdownJnsPend() {
        this.dataMasterService.getJnsPendapatan5().subscribe((res) => {
            this.optJnsPend = [...res["data"]];
        });
    }

    //#endregion

    //#region DROPDOWNS CHANGE
    changeDropdownGrupUsaha() {
        if (this.addEditFields.GrupUsaha === "3") {
            this.optWilayahUptAdd = [
                ...this.optWilayahUpt.filter((s) => s.Kode !== "0"),
            ];
        } else {
            this.optWilayahUptAdd = [...this.optWilayahUpt];
            this.optWilayahUptAddSelected = this.optWilayahUpt.filter(
                (s) => s.Kode === "0"
            )[0];
        }
    }

    rowSelectinChild(event: any) {
        this.selectedSkp = event;
    }
    //#endregion

    //#region CRUD
    saveData() {
        this.submitted = true;
        if (this.validate()) {
            this.submitted = false;
            this.isLoading = true;
            let body = {
                BadanID: this.addEditFields.BadanID,
                SetoranDari: "-",
                TglPendaftaran: formatDate(
                    this.addEditFields.TglPendaftaran,
                    "yyyy-MM-dd",
                    "en-US"
                ),
                Keterangan: this.addEditFields.Keterangan,
                GrupUsaha: this.addEditFields.GrupUsaha,
                BendaharaID: this.addEditFields.BendaharaID,
                WPID: this.addEditFields.WPID,
            };
            this.daftarpotensiService.postNewData(body).subscribe(
                (_resp) => {
                    if (_resp["status_code"] === 1) {
                        let dataRes = _resp["data"];
                        // console.log(dataRes);
                        let dataDetail = [];
                        let SetoranHistID = [];
                        this.selectedSkp.reduce(function (res, value) {
                            if (!res[value.PotensiID]) {
                                res[value.PotensiID] = {
                                    PotensiID: value.PotensiID,
                                    JmlSetoran: 0,
                                };
                                dataDetail.push(res[value.PotensiID]);
                            }
                            res[value.PotensiID].JmlSetoran += parseInt(
                                value.Jumlah
                            );
                            return res;
                        }, {});

                        if (this.optFromSKP) {
                            this.selectedSkp.forEach((element) => {
                                SetoranHistID.push(element.SetoranHistID);
                            });
                        }

                        let params = {
                            WPID: dataRes.WPID,
                            dataDetail: JSON.stringify(dataDetail),
                            SetoranHistID: SetoranHistID,
                        };
                        // console.log(params);

                        this.daftarpotensiService
                            .postNewDataDetail2(params)
                            .subscribe((respDet) => {
                                this.resetTable();
                                // console.log(respDet);
                                sessionStorage.setItem(
                                    "daftarpotensi_laststst",
                                    this.addEditFields.WPID
                                );
                                this.isLoading = false;
                                this.router.navigate([
                                    `/admin/daftarpotensi_det/${dataRes.WPID}`,
                                ]);
                            });
                    }
                },
                (_error) => {
                    this.messageService.add({
                        severity: "error",
                        summary: "DaftarPotensi Gagal Ditambahkan",
                        detail: `DaftarPotensi gagal ditambahkan.`,
                        life: 3000,
                    });
                    this.isLoading = false;
                }
            );
        }
    }

    

    deleteData(dataRow: any) {
        this.confirmationService.confirm({
            message: "Yakin mau hapus data ?",
            header: "Hapus Data",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Ya",
            rejectLabel: "Batal",
            accept: () => {
                var id = dataRow.WPID;
                this.daftarpotensiService.deleteData(id).subscribe(
                    (_resp) => {
                        this.selectedDatas = null;
                        this.resetTable();
                        this.isLoading = false;
                        this.messageService.add({
                            severity: "success",
                            summary: "Berhasil Menghapus",
                            detail: `Data berhasil dihapus`,
                            life: 3000,
                        });
                    },
                    (_error) => {
                        this.isLoading = false;
                        this.messageService.add({
                            severity: "error",
                            summary: "Gagal Menghapus",
                            detail: `Data gagal dihapus`,
                            life: 3000,
                        });
                    }
                );
            },
        });
    }


    //#region HELPER
    validate() {
        // console.log(this.addEditFields)
        let validate =
            this.addEditFields.BadanID &&
            this.addEditFields.WPID &&
            this.addEditFields.TglPendaftaran &&
            this.addEditFields.Keterangan &&
            this.selectedSkp[0]?.PotensiID &&
            this.selectedSkp[0]?.Jumlah;

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
