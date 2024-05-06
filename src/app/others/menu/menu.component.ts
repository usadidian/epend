import {
    DatePipe,
    formatDate,
    Location,
    PlatformLocation,
} from "@angular/common";
import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
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
import { MenuService } from "src/app/Services/menu.service";
import { DataMasterService } from "src/app/Services/data_master.service";
import { ActivatedRoute, NavigationStart, Router } from "@angular/router";
import { debounceTime, filter, map, switchAll, tap } from "rxjs/operators";
import { DomSanitizer } from "@angular/platform-browser";
import {
    base64ToFile,
    ImageCroppedEvent,
    ImageCropperModule,
} from "ngx-image-cropper";
import { SafePipeModule } from "safe-pipe";
import { fromEvent, of } from "rxjs";
import { ApiService } from "src/app/Services/api.service";
import { PendataanService } from "src/app/Services/pendataan.service";
// import { AngularFileUploaderConfig } from "angular-file-uploader";
declare var google: any;
@Component({
    selector: "app-master-menu",
    templateUrl: "./menu.component.html",
    styleUrls: ["./menu.component.scss"],
    styles: [``],
    providers: [MessageService, ConfirmationService, DatePipe, SafePipeModule],
})
export class MenuComponent implements OnInit {
    resetUpload: boolean;

    @ViewChild("dt") dt: any;
    @ViewChild("inputNpwpd") inputNpwpd: ElementRef;
    @ViewChild("inputNamaUsaha") inputNamaUsaha: ElementRef;
    @ViewChild("avatarimg") avatarimg: ElementRef;
    @ViewChild("uploaddoc") uploaddoc: ElementRef;
    @HostListener("window:popstate", ["$event"])
    onPopState(event) {
        this.productDialog = false;
        this.productDialogDet = false;
        this.productDialogDet2 = false;
    }
    isMobile: boolean = window.innerWidth <= 640;
    submitted: boolean;
    editable: boolean = true;
    isLoading: boolean;
    isLoadingDt: boolean = false;
    isLoadingModal: boolean;
    isLoadingMap: boolean;
    resetDt: boolean = false;
    searchQuery: any;
    statEditAdd: any;
    activeIndex: number = 0;
    steps_form: MenuItem[];
    steps_form_header: MenuItem[];
    productDialog: boolean;
    productDialogDet: boolean;
    productDialogDet2: boolean;
    npwpdState: boolean = false;
    modalDetTitle = "";
    temp: any;
    products: any;
    data: any;
    rowGroupMetadata: any;

    length: number;
    totalRecords: number;
    page: number;

    /// doc upload
    doc: string;
    ////IMG
    avatar: string;
    imageChangedEvent: any = "";
    croppedImage: any = "";
    dialogImg: boolean;
    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
        this.dialogImg = true;
    }
    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
        // console.log(event);
        // console.log(event.base64.replace(/^data:image\/(png|jpg);base64,/, ""));
        // const im: HTMLImageElement =
        //     this.el.nativeElement.querySelector("#avatarimg");
        // console.log(event.base64);
        // im.src = event.base64.replace(/^data:image\/(png|jpg);base64,/, "");
    }
    imageLoaded() {
        // show cropper
    }
    cropperReady() {
        // cropper ready
    }
    loadImageFailed() {
        // show message
    }
    /////////////////////////

    selectedProducts: any[];
    cols: any[];

    tempPrint: any;
    initFields: any = {
        /////REQUIRED : badan
        // MenuId: "",
        Kode: "",
        Menu: "",
        Tipe:"",
        UrlId: "",
        Url: "",
    };
    addEditFields: any = {};
    tempEditFields: any;

    selectedDrop: SelectItem;
    optJenis: SelectItem[];
    optJenis2: SelectItem[];
    optJenisAdd: any[];
    optJenisEdit: any[];

    optJnsUsaha: any[];
    optJnsUsahaSelected: any;
    optNamaBadan: SelectItem[];
    NamaBadanSelected: any;
    dialogState: string;
    tempLastNpwpd: any;

    mapOptions: any;
    overlays: any[];
    dialogVisible: boolean;
    markerTitle: string;
    selectedPosition: any;
    infoWindow: any;
    draggable: boolean;
    // street: string = null;
    // mapsURL = `https://maps.google.com/maps?q=${this.street}&z=18&output=embed`;
    loading = new EventEmitter<boolean>();
    constructor(
        private dataMasterService: DataMasterService,
        public menuService: MenuService,
        public pendataanService: PendataanService,
        public apiService: ApiService,
        private messageService: MessageService,
        public datepipe: DatePipe,
        private confirmationService: ConfirmationService,
        private breadcrumbService: AppBreadcrumbService,
        private ref: ChangeDetectorRef,
        private router: Router,
        private el: ElementRef,
        private route: ActivatedRoute,
        public sanitizer: DomSanitizer,
        location: PlatformLocation
    ) {
        this.breadcrumbService.setItems([
            // { label: 'Menu' },
            { label: "Menu", routerLink: ["/menu"] },
        ]);

        if (this.router.getCurrentNavigation().extras.state) {
            this.dialogState = this.router.getCurrentNavigation()
                ? this.router.getCurrentNavigation().extras.state.dialog
                : null;
        }
    }

    ngAfterContentChecked() {
        this.ref.detectChanges();
    }

    // dateRange
    id: any;
    minDate: Date;
    maxDate: Date;
    rangeDates: Date[];
    rangeValue: number = 1;
    maxInput: number = 31;
    curDateOpt: any[];
    curDateSelected: any = { label: "Hari", value: "day" };



    ngOnInit() {
        this.isLoading = true;
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
        this.minDate = new Date();
        this.minDate.setMonth(prevMonth);
        this.minDate.setFullYear(prevYear);
        this.maxDate = new Date();
        this.maxDate.setMonth(nextMonth);
        this.maxDate.setFullYear(nextYear);
        this.rangeDates = [
            new Date(),
            new Date(Date.now() + 1 * 3600 * 1000 * 24),
        ];
        this.curDateOpt = [
            { label: "Hari", value: "day" },
            { label: "Bulan", value: "month" },
            { label: "Tahun", value: "year" },
        ];

        this.mapOptions = {
            center: { lat: -7.311218, lng: 108.1664283 },
            zoom: 17,
            navigationControl: false,
            mapTypeControl: false,
        };
        this.initOverlays();
        // this.infoWindow = new google.maps.InfoWindow();
        this.isLoading = true;
        this.steps_form = [
            // {
            //     label: "Informasi Usaha",
            //     icon: "pi pi-home",
            //     command: (event) => {},
            // },
            // {
            //     label: "Pemilik & Pengelola",
            //     icon: "pi pi-home",
            //     command: (event) => {},
            // },
            // {
            //     label: "Url",
            //     icon: "pi pi-home",
            //     command: (event) => {},
            // },
        ];

        this.steps_form_header = [
            // {
            //     label: "Informasi Usaha",
            //     icon: "pi pi-home",
            //     command: (event) => {},
            // },
            // {
            //     label: "Pemilik & Pengelola",
            //     icon: "pi pi-home",
            //     command: (event) => {},
            // },
        ];

        this.cols = [
            { field: "Kode", header: "Kode" },
            { field: "Menu", header: "Menu" },
            { field: "Url", header: "Url" },
            { field: "Tipe", header: "Tipe" },
        ];

        this.dataMasterService.getJnsUrl().subscribe((res) => {
            // this.temp = [...res["data"]];
            // if (!this.optJenis) {
            //     // this.optJenis = [{ label: 'Semua', value: null }];
            //     // const { length } = this.optJenis;
            //     // const id = length + 1;
            //     // const found = this.optJenis.some(el => el.label === 'Semua');
            //     // if (!found) this.optJenis.unshift({ label: 'Semua', value: null });
            // }
            this.optJenis = [];
            this.optJenis2 = [];
            res["data"].forEach((x) => {
                this.optJenis.push({
                    label: x.Url,
                    value: x.UrlId,
                    icon: x.icon,
                });
                this.optJenis2.push({
                    label: x.Url,
                    value: x.UrlId,
                    icon: x.icon,
                });
            });
            const { length } = this.optJenis2;
            const id = length + 1;
            const found = this.optJenis2.some((el) => el.label === "Semua");
            if (!found)
                this.optJenis2.unshift({
                    label: "Semua",
                    value: null,
                    icon: null,
                });
            this.updateRowGroupMetaData();
            if (this.dialogState == "add") {
                this.openNew();
            }
        });
    }

    ngOnDestroy() {
        if (window.history.state.modal) {
            history.back();
        }
    }

    ngAfterViewInit() {}

    handleMapClick(event) {
        // this.dialogVisible = true;
        this.selectedPosition = event.latLng;
        this.addMarker();
    }

    handleOverlayClick(event) {
        let isMarker = event.overlay.getTitle != undefined;

        if (isMarker) {
            let title = event.overlay.getTitle();
            this.infoWindow.setContent("" + title + "");
            this.infoWindow.open(event.map, event.overlay);
            event.map.setCenter(event.overlay.getPosition());

            this.messageService.add({
                severity: "info",
                summary: "Marker Selected",
                detail: title,
            });
        } else {
            this.messageService.add({
                severity: "info",
                summary: "Shape Selected",
                detail: "",
            });
        }
    }

    addMarker() {
        this.markerTitle = `Lokasi ${this.addEditFields.Menu}`;
        this.overlays = [
            new google.maps.Marker({
                position: {
                    lat: this.selectedPosition.lat(),
                    lng: this.selectedPosition.lng(),
                },
                title: this.markerTitle,
                draggable: this.draggable,
            }),
        ];
        this.addEditFields.latlng = `${this.selectedPosition.lat()},${this.selectedPosition.lng()}`;
        this.dialogVisible = false;
    }

    handleDragEnd(event) {
        this.messageService.add({
            severity: "info",
            summary: "Marker Dragged",
            detail: event.overlay.getTitle(),
        });
    }

    initOverlays() {
        if (!this.overlays || !this.overlays.length) {
            this.overlays = [];
        }
    }

    getMapSuggest() {
        // this.initOverlays();
        // let name = `${data["data"]["Menu"]}, ` || "";
        // let street = `${data["data"]["AlamatBadan"]}, ` || "";
        // // let city = `${this.citySelected?.name}` || "";
        // let city = `${
        //     this.citySelected?.name.split(",")[0].split(".")[1] || ""
        // }`;
        // this.street = `${name}${street}${city}`;
        // console.log(this.street);
        // this.mapsURL = `https://maps.google.com/maps?q=${this.street}&z=18&output=embed`;
    }


    //////ADD-EDIT
    nextPage() {
        if (this.statEditAdd !== "edit" && this.statEditAdd !== "edit_header") {
            this.submitted = true;
            if (this.activeIndex == 0) {
                if (
                    this.addEditFields.Menu &&
                    // && this.addEditFields.UrlId
                    // && this.addEditFields.AlamatBadan
                    // && this.addEditFields.NoTelpBadan
                    this.addEditFields.KotaBadan &&
                    this.addEditFields.KecamatanBadan &&
                    this.addEditFields.KelurahanBadan &&
                    this.addEditFields.PetugasPendaftar &&
                    this.addEditFields.TglMenu &&
                    this.addEditFields.TglPengesahan
                ) {
                    this.submitted = false;
                    this.activeIndex = this.activeIndex + 1;
                }
            } else {
                if (
                    // this.addEditFields.NPWPPemilik
                    // &&
                    this.addEditFields.NamaPemilik &&
                    // && this.addEditFields.AlamatPemilik
                    // && this.addEditFields.NoTelpPemilik
                    this.addEditFields.KotaPemilik &&
                    this.addEditFields.KecamatanPemilik &&
                    this.addEditFields.KelurahanPemilik
                ) {
                    this.submitted = false;
                    this.activeIndex = this.activeIndex + 1;
                } else {
                    Object.entries(this.addEditFields).forEach((o) =>
                        o[1] === null || o[1] === undefined || o[1] === ""
                            ? delete this.addEditFields[o[0]]
                            : 0
                    );
                    return;
                }
            }
        } else {
            // console.log(this.statEditAdd)
            this.activeIndex = this.activeIndex + 1;
            return;
        }
    }


    ///DATATABLES
    loadDataLazy(event: LazyLoadEvent) {
        this.isLoading = false;
        let par: any = null;
        if (event) {
            if (event?.filters?.global) {
                this.searchQuery = event.filters.global.value;
            }

            if (event?.filters?.search_jenis) {
                this.selectedDrop = event.filters.search_jenis.value.value;
            }

            this.length = event?.first;
            par = event;
        } else {
            par = JSON.parse(sessionStorage.getItem("menu"));
        }
        this.isLoadingDt = true;
        this.menuService
            .getViewMenuLazy(par, this.resetDt)
            .subscribe((data) => {
                // this.tempProducts = data["data"];
                this.products = data["data"];
                this.totalRecords = data["records_total"];
                this.updateRowGroupMetaData();
                this.isLoadingDt = false;
                // this.isLoading = false;
                this.resetDt = false;
                // if(!this.isLoadedDt) this.isLoadedDt = true;
            });
    }

    // onSort() {
    //   this.updateRowGroupMetaData();
    // }

    updateRowGroupMetaData() {
        // console.log('updateRowGroupMetaData');
        this.rowGroupMetadata = {};
        if (this.products) {
            for (let i = 0; i < this.products.length; i++) {
                let rowData = this.products[i];
                let representativeName = rowData["MenuId"];
                if (i == 0) {
                    this.rowGroupMetadata[representativeName] = {
                        index: 0,
                        size: 1,
                    };
                } else {
                    let previousRowData = this.products[i - 1];
                    let previousRowGroup = previousRowData["MenuId"];
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
        // this.selectedDrop = null;
        // this.searchQuery = "";
        this.resetDt = true;
        this.loadDataLazy(null);
        // this.dt.clear();
        // this.dt.clearCache();
        // this.updateRowGroupMetaData();
    }

    showDialogMaximized(event, dialog: Dialog) {
        if (window.innerWidth < 960) {
            dialog.maximized = false;
            dialog.maximize();
        }
    }

    // getDropdownJenisUsaha(event: any) {
    //     // console.log(this.addEditFields.GrupUsahaID);
    //     if (!this.optJnsUsaha) {
    //         ////// DROPDOWN
    //         // this.menuService.getJenisUsaha().subscribe(res => {
    //         //   this.temp = res["data"];
    //         //   this.temp.forEach(x => {
    //         //     this.optJnsUsaha.push({ label: x.GrupUsaha, value: x.GrupUsahaID });
    //         //   });
    //         // });

    //         ////// AUTOCOMPLETE
    //         this.menuService.getJenisUsaha().subscribe((res) => {
    //             this.optJnsUsaha = res["data"];
    //             // setTimeout(() => {
    //             //     event.srcElement.blur();
    //             // }, 1);
    //         });
    //     } else {
    //         if (this.optJnsUsaha.length === 1) {
    //             this.menuService.getJenisUsaha().subscribe((res) => {
    //                 this.optJnsUsaha = res["data"];
    //                 // setTimeout(() => {
    //                 //     event.srcElement.blur();
    //                 // }, 1);
    //             });
    //         } else {
    //             this.optJnsUsaha = [...this.optJnsUsaha];
    //             // setTimeout(() => {
    //             //     event.srcElement.blur();
    //             // }, 1);
    //         }
    //     }
    // }

    clonedProducts: { [s: string]: any } = {};
    onRowEditInit(data: any) {
        this.clonedProducts[data.MenuID] = { ...data };
    }

    onRowEditSave(data: any) {
        this.saveProductDet();
        delete this.clonedProducts[data.MenuID];
    }

    onRowEditCancel(data: any, index: number) {
        this.products[index] = this.clonedProducts[data.MenuID];
    }

    disabledDelRow(value: string) {
        let valuearr = value.split(".");
        if (parseInt(valuearr[3]) > 9) {
            return true;
        }
        return false;
    }


    openNew() {
        const modalState = {
            modal: true,
        };
        history.pushState(modalState, null);
        this.activeIndex = 0;
        this.statEditAdd = "add";
        this.submitted = false;
        this.productDialog = true;
        this.editable = false;
        // // this.addEditFields.UrlId = this.selectedDrop ?? null;
        this.addEditFields.UrlId = null;
        this.addEditFields = Object.assign({}, this.initFields);
        this.optJenisAdd = this.optJenis?.slice(1);
        // this.optJenisAdd?.unshift({ label: "", value: null });
        // this.showDialog();
        this.productDialog = true;

    }

    hideDialog() {
        if (window.history.state.modal) {
            history.back();
        }
        this.activeIndex = 0;
        this.productDialog = false;
        this.submitted = false;
        this.data = {};
    }

    editProduct(data: any) {
        const modalState = {
            modal: true,
        };
        history.pushState(modalState, null);
        this.optJenisEdit = this.optJenis.slice(1);
        this.activeIndex = 0;
        this.isLoadingModal = true;
        this.statEditAdd = "edit";
        this.overlays = [];
        // this.showDialog();
        this.menuService
            .getEditMenu1(data.MenuId)
            .subscribe((data) => {
                this.addEditFields = Object.assign({}, data["data"]);
                this.tempEditFields = Object.assign({}, this.addEditFields);
                // this.tempEditFields["Kode"] = this.addEditFields.Kode;
                // this.addEditFields.Kode = data["data"].Kode;
                this.tempEditFields.Kode = this.addEditFields.Kode
                this.isLoadingModal = false;
                this.productDialog = true;
                console.log(this.tempEditFields.Kode)
            });
    }

    addProductDet(data: any) {
        const modalState = {
            modal: true,
        };
        history.pushState(modalState, null);
        this.data = {};
        this.data = data;
        let id = data["MenuId"];
        let disabledOPArr = [];
        this.products
            .filter(function (el: any) {
                return el.MenuId == id;
            })
            .forEach((dis: any) => {
                disabledOPArr.push(dis.UrlId);
            });

        let newOptJenis = [];
        this.optJenis.forEach((entry) => {
            let inactive = false;
            inactive = disabledOPArr.includes(entry.value);
            newOptJenis.push({
                label: entry.label,
                value: entry.value,
                disabled: inactive,
            });
        });
        this.optJenis = [...newOptJenis];
        this.modalDetTitle =
            "Tambah Url untuk " + this.data["Menu"];
        this.addEditFields.UrlId = null;
        this.productDialogDet = true;
    }

    addProductDet2() {
        this.data = {};
        this.modalDetTitle = "Tambah Url Baru";
        this.addEditFields.UrlId = null;
        this.productDialogDet2 = true;
    }

    saveProduct() {
        this.isLoading = true;
        this.submitted = true;
        if (this.statEditAdd === "edit" || this.statEditAdd === "edit_header") {
            const oldData = Object.assign({}, this.tempEditFields);
            const editedData = Object.assign({}, this.addEditFields);
            let editedFields = {};
            Object.keys(oldData).forEach(function (key) {
                // console.log(key, oldData[key], editedData[key]);
                if (
                    oldData[key] != editedData[key] ||
                    key == "UrlId"
                ) {
                    editedFields[key] = editedData[key];
                }
            });
            // console.log(this.croppedImage);
            // console.log(editedFields);
            // if (this.croppedImage) {
            //     let File = base64ToFile(this.croppedImage);
            //     editedFields["avatar"] = File;
            //     // const im: HTMLImageElement =
            //     //     this.el.nativeElement.querySelector("#avatarimg");
            //     // im.src = data;
            // }
            if (Object.keys(editedFields).length > 2) {
                this.menuService
                    .updateMenu(
                        this.tempEditFields["MenuId"],
                        editedFields
                    )
                    .subscribe(
                        (resp) => {
                            this.messageService.add({
                                severity: "success",
                                summary: "Data Berhasil Diubah",
                                detail: `${this.tempEditFields.Menu} berhasil diubah.`,
                                life: 3000,
                            });
                            this.resetTable();
                        },
                        (error) => {
                            this.messageService.add({
                                severity: "error",
                                summary: "Data WP Gagal Diubah",
                                detail: `Usaha ${this.tempEditFields.Menu} gagal diubah.`,
                                life: 3000,
                            });
                        }
                    );
            } else {
                this.messageService.add({
                    severity: "info",
                    summary: "Tidak ada perubahan",
                    detail: `Tidak ada perubahan data pada Usaha ${this.addEditFields.Menu}.`,
                    life: 3000,
                });
            }
        } else {
            // if (this.croppedImage) {
            //     let File = base64ToFile(this.croppedImage);
            //     this.addEditFields["avatar"] = File;
            //     // const im: HTMLImageElement =
            //     //     this.el.nativeElement.querySelector("#avatarimg");
            //     // im.src = data;
            // }
            Object.entries(this.addEditFields).forEach((o) =>
                o[1] === null || o[1] === undefined || o[1] === ""
                    ? delete this.addEditFields[o[0]]
                    : 0
            );
            // this.addEditFields.Kode = 
            //     this.addEditFields.Kode;               ;
           
            this.menuService
                .addMenu(this.addEditFields)
                .subscribe(
                    (resp) => {
                        this.messageService.add({
                            severity: "success",
                            summary: "WP Berhasil Ditambahkan",
                            detail: `Usaha ${this.addEditFields.Menu} berhasil ditambahkan.`,
                            life: 3000,
                        });
                        this.resetTable();
                        this.pendataanService.setRefresh();
                        this.apiService.setRefreshHomeChart1();
                    },
                    (error) => {
                        this.messageService.add({
                            severity: "error",
                            summary: "WP Gagal Ditambahkan",
                            detail: `Usaha ${this.addEditFields.Menu} gagal ditambahkan.`,
                            life: 3000,
                        });
                    }
                );
        }
        this.isLoading = false;
        this.productDialog = false;
    }

    saveProductDet() {
        this.isLoading = true;
        this.submitted = true;
        var parData = {
            UrlId: this.addEditFields.UrlId,
        };
        this.menuService
            .addMenuDet(this.data["MenuId"], parData)
            .subscribe(
                (resp) => {
                    this.messageService.add({
                        severity: "success",
                        summary: "Url Berhasil Ditambahkan",
                        detail: `Url berhasil ditambahkan.`,
                        life: 3000,
                    });

                    this.resetTable();
                },
                (error) => {
                    this.messageService.add({
                        severity: "error",
                        summary: "Url Gagal Ditambahkan",
                        detail: `Url gagal ditambahkan.`,
                        life: 3000,
                    });
                }
            );

        this.isLoading = false;
        this.productDialogDet = false;
    }

    deleteSelectedProducts() {
        this.menuService.delMenus({
            message: "Yakin mau hapus data?",
            header: "Hapus Data Terpilih",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Ya",
            rejectLabel: "Batal",
            accept: () => {
                var ids = {
                    id: this.selectedProducts.map(function (item) {
                        return `${item["UrlId"]}`;
                    }),
                };
                // var names_array = this.selectedProducts.map(function (item) {
                //     return item["Menu"];
                // });

                this.menuService.delMenus(ids).subscribe(
                    (resp) => {
                        this.isLoading = false;
                        this.messageService.add({
                            severity: "success",
                            summary: "Berhasil Menghapus",
                            detail: `Data berhasil dihapus`,
                            life: 3000,
                        });
                        // this.products = this.products.filter(val => !this.selectedProducts.includes(val));
                        this.selectedProducts = null;
                        this.resetTable();
                    },
                    (error) => {
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

    // nonActiveProduct(data: any) {
    //     this.menuService.confirm({
    //         message:
    //             "Apakah anda yakin akan me-non-aktifkan usaha " +
    //             data["Menu"] +
    //             "?",
    //         header: `Non Aktifkan ${data["Menu"]}`,
    //         icon: "pi pi-exclamation-triangle",
    //         acceptLabel: "Ya",
    //         rejectLabel: "Batal",
    //         accept: () => {
    //             this.wpNonAktifServiceStore.addData(data).then(
    //                 (resp) => {
    //                     this.isLoading = false;
    //                     this.messageService.add({
    //                         severity: "success",
    //                         summary: "Berhasil",
    //                         detail: `Usaha ${data["Menu"]} telah di-NonAktifkan`,
    //                         life: 3000,
    //                     });
    //                     this.resetTable();
    //                     this.wpNonAktifServiceStore.setRefresh();
    //                     this.selectedProducts = null;
    //                 },
    //                 (error) => {
    //                     this.isLoading = false;
    //                     this.messageService.add({
    //                         severity: "error",
    //                         summary: "Gagal",
    //                         detail: `Data usaha ${data["Menu"]} gagal di-NonAktifkan`,
    //                         life: 3000,
    //                     });
    //                 }
    //             );
    //         },
    //     });
    // }

    deleteProduct(data: any) {
        this.confirmationService.confirm({
            message: `Apakah anda yakin akan menghapus url ${data["Url"]} menu ${data["Menu"]} ?`,
            header: `Hapus Url`,
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Ya",
            rejectLabel: "Batal",
            accept: () => {
                var id = data["MenuId"];
                this.menuService.delMenu(id).subscribe(
                    (resp) => {
                        this.isLoading = false;
                        this.messageService.add({
                            severity: "success",
                            summary: "Berhasil Menghapus",
                            detail: ` Url ${data["Url"]} menu ${data["Menu"]} berhasil dihapus`,
                            life: 3000,
                        });
                        this.resetTable();
                        this.selectedProducts = null;
                        // this.products = this.products.filter(val => !this.selectedProducts.includes(val));
                    },
                    (error) => {
                        this.isLoading = false;
                        this.messageService.add({
                            severity: "error",
                            summary: "Gagal Menghapus",
                            detail: ` Url ${data["Url"]} menu ${data["Menu"]} gagal dihapus`,
                            life: 3000,
                        });
                    }
                );
            },
        });
    }

}
