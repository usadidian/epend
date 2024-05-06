import { DatePipe } from "@angular/common";
import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    LOCALE_ID,
    OnInit,
    Output,
    ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { ConfirmationService, MessageService, SelectItem } from "primeng/api";
import { AppBreadcrumbService } from "src/app/app.breadcrumb.service";
import { DataMasterService } from "src/app/Services/data_master.service";
import { DaftarPotensiService } from "src/app/Services/daftarpotensi.service";
import { environment } from "src/environments/environment";

@Component({
    selector: "app-daftarpotensi-modal",
    templateUrl: "./daftarpotensi_modal.component.html",
    styleUrls: ["./daftarpotensi_modal.component.scss"],
    providers: [
        MessageService,
        ConfirmationService,
        DatePipe,
        { provide: LOCALE_ID, useValue: "id-ID" },
    ],
})
export class DaftarPotensiModalComponent implements OnInit {
    @Output() rowSelect: EventEmitter<any[]> = new EventEmitter();
    @ViewChild("dt") dt: any;

    constructor(
        private daftarpotensiService: DaftarPotensiService,
        public datepipe: DatePipe,
        private ref: ChangeDetectorRef
    ) {}

    environment: any = { ...environment };
    submitted: boolean;
    isLoading: boolean;
    isLoadingDt: boolean = false;
    loadingLookup: boolean;
    isMobile: boolean = window.innerWidth <= 640;
    resetDt: boolean = false;
    //#region Data Var
    datas: any;
    data: any;
    selectedSkp: any[];
    //#endregion

    // dateRange
    id: any;

    //#region DROPDOWN Var
    optSkpLookup: SelectItem[];
    optSkpLookupSelected: SelectItem[];
    //#endregion

    ngAfterContentChecked() {
        this.ref.detectChanges();
    }

    ngOnInit() {
        this.isLoading = true;
        this.getDropdownSkp();

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
    }

    ngOnDestroy() {}

    //#region DATATABLES
    trackByFunction = (_index, item) => {
        return item.NoKohir; // O index
    };

    onRowSelect(event: any) {
        // console.log(event);
        // console.log(this.selectedSkp);
        this.rowSelect.emit(this.selectedSkp);
    }

    resetTable() {
        this.resetDt = true;
        this.dt.reset();
    }
    //#endregion

    //#region DROPDOWNS FILL

    getDropdownSkp() {
        this.daftarpotensiService.getSKPLookup().subscribe((res) => {
            this.isLoading = false;
            this.optSkpLookup = [...res["data"]];
        });
    }

    //#endregion

    //#region HELPER
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
