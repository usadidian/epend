import { Component } from '@angular/core';
import {AppBreadcrumbService} from '../app.breadcrumb.service';

@Component({
    selector: 'app-invoice',
    templateUrl: './app.invoice.component.html',
})
export class AppInvoiceComponent {

    constructor(private breadcrumbService: AppBreadcrumbService) {
        this.breadcrumbService.setItems([
            { label: 'Pages' },
            { label: 'Invoice', routerLink: ['pages/invoice'] }
        ]);
    }

    print() {
        window.print();
    }
}
