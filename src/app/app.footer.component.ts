import { Component } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { environment } from "src/environments/environment";

@Component({
    selector: "app-footer",
    template: `
        <div class="footer">
            <div class="card clearfix">
                <span class="footer-text-left"
                    >${environment.appName} ${environment.appVersion} |
                    {{ unitInfo.appCopyrightBy }}</span
                >
                
            </div>
        </div>
    `,

    // template: `
    //     <div class="footer">
    //         <div class="card clearfix">
    //             <span class="footer-text-left"
    //                 >${environment.appName} ${environment.appVersion} |
    //                 {{ unitInfo.appCopyrightBy }}</span
    //             >
    //             <span class="footer-text-right">
    //                 <span>Development by ${environment.appDevelopBy}</span>
    //             </span>
    //         </div>
    //     </div>
    // `,
})
export class AppFooterComponent {
    constructor(private titleService: Title) {
        this.getUnitInfoStorage();
    }

    unitInfo: any;

    getUnitInfoStorage() {
        const data_str = localStorage.getItem("unitInfo");
        const data = JSON.parse(data_str);
        // console.log(data);
        this.unitInfo = data;
        this.titleService.setTitle(
            `${environment.appName} - ${data.appCopyrightBy}`
        );
    }
}
