import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { AppRoutingModule } from "./app-routing.module";
import 'hammerjs';


// PrimeNG Components for demos
import { AccordionModule } from "primeng/accordion";
import { AutoCompleteModule } from "primeng/autocomplete";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { CardModule } from "primeng/card";
import { CarouselModule } from "primeng/carousel";
import { ChartModule } from "primeng/chart";
import { CheckboxModule } from "primeng/checkbox";
import { ChipsModule } from "primeng/chips";
import { CodeHighlighterModule } from "primeng/codehighlighter";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ColorPickerModule } from "primeng/colorpicker";
import { ContextMenuModule } from "primeng/contextmenu";
import { DataViewModule } from "primeng/dataview";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { FieldsetModule } from "primeng/fieldset";
import { FileUploadModule } from "primeng/fileupload";
import { FullCalendarModule } from "primeng/fullcalendar";
import { GalleriaModule } from "primeng/galleria";
import { InplaceModule } from "primeng/inplace";
import { InputNumberModule } from "primeng/inputnumber";
import { InputMaskModule } from "primeng/inputmask";
import { InputSwitchModule } from "primeng/inputswitch";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { LightboxModule } from "primeng/lightbox";
import { ListboxModule } from "primeng/listbox";
import { MegaMenuModule } from "primeng/megamenu";
import { MenuModule } from "primeng/menu";
import { MenubarModule } from "primeng/menubar";
import { MessagesModule } from "primeng/messages";
import { MessageModule } from "primeng/message";
import { MultiSelectModule } from "primeng/multiselect";
import { OrderListModule } from "primeng/orderlist";
import { OrganizationChartModule } from "primeng/organizationchart";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { PaginatorModule } from "primeng/paginator";
import { PanelModule } from "primeng/panel";
import { PanelMenuModule } from "primeng/panelmenu";
import { PasswordModule } from "primeng/password";
import { PickListModule } from "primeng/picklist";
import { ProgressBarModule } from "primeng/progressbar";
import { RadioButtonModule } from "primeng/radiobutton";
import { RatingModule } from "primeng/rating";
import { RippleModule } from "primeng/ripple";
import { ScrollPanelModule } from "primeng/scrollpanel";
import { SelectButtonModule } from "primeng/selectbutton";
import { SidebarModule } from "primeng/sidebar";
import { SlideMenuModule } from "primeng/slidemenu";
import { SliderModule } from "primeng/slider";
import { SplitButtonModule } from "primeng/splitbutton";
import { StepsModule } from "primeng/steps";
import { TabMenuModule } from "primeng/tabmenu";
import { TableModule } from "primeng/table";
import { TabViewModule } from "primeng/tabview";
import { TerminalModule } from "primeng/terminal";
import { TieredMenuModule } from "primeng/tieredmenu";
import { ToastModule } from "primeng/toast";
import { ToggleButtonModule } from "primeng/togglebutton";
import { ToolbarModule } from "primeng/toolbar";
import { TooltipModule } from "primeng/tooltip";
import { TreeModule } from "primeng/tree";
import { TreeTableModule } from "primeng/treetable";
import { VirtualScrollerModule } from "primeng/virtualscroller";
import { BlockUIModule } from "primeng/blockui";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { GMapModule } from "primeng/gmap";
import { EditorModule } from "primeng/editor";

// Application Components
import { AppCodeModule } from "./app.code.component";
import { AppComponent } from "./app.component";
import { AppMainComponent } from "./app.main.component";
import { AppMenuComponent } from "./app.menu.component";
import { AppMenuitemComponent } from "./app.menuitem.component";
import { AppInlineProfileComponent } from "./app.profile.component";
import { AppBreadcrumbComponent } from "./app.breadcrumb.component";
import { AppConfigComponent } from "./app.config.component";
import { AppRightpanelComponent } from "./app.rightpanel.component";
import { AppTopbarComponent } from "./app.topbar.component";
import { AppFooterComponent } from "./app.footer.component";

import { AppNotfoundComponent } from "./pages/app.notfound.component";
import { AppErrorComponent } from "./pages/app.error.component";
import { AppAccessdeniedComponent } from "./pages/app.accessdenied.component";
import { AppLoginComponent } from "./pages/app.login.component";
import { AppHelpComponent } from "./pages/app.help.component";
import { AppInvoiceComponent } from "./pages/app.invoice.component";
import { AppWizardComponent } from "./pages/app.wizard.component";
import { IvyCarouselModule } from "angular-responsive-carousel";

// Application services
import { AppBreadcrumbService } from "./app.breadcrumb.service";
import { MenuService } from "./app.menu.service";
import { JwtModule } from "@auth0/angular-jwt";
import { AngularFireMessagingModule } from "@angular/fire/messaging";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireModule } from "@angular/fire";
import { environment } from "../environments/environment";
import { AsyncPipe } from "../../node_modules/@angular/common";

import { ErrorInterceptor } from "./Services/ErrorInterceptor ";
// others component
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
import { AvatarModule } from "ngx-avatar";
import { ImageCropperModule } from "ngx-image-cropper";
import { SafePipeModule } from "safe-pipe";
import { NgxYoutubePlayerModule } from "ngx-youtube-player";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { LoginComponent } from "./login/login.component";

import { DaftarPotensiComponent } from "./main/daftarpotensi/daftarpotensi.component";
import { DaftarPotensiModalComponent } from "./main/daftarpotensi/modal/daftarpotensi_modal.component";
import { DaftarPotensiDetailComponent } from "./main/daftarpotensi/detail/daftarpotensi_detail.component";


//////USERS

import { UsersComponent } from "./others/users/users.component";
import { GroupsComponent } from "./others/groups/groups.component";


//////FORGOT PWD
import { ForgotPwdComponent } from "./others/forgot-pwd/forgot-pwd.component";
import { ResetPwdComponent } from "./others/reset-pwd/reset-pwd.component";

//////ARTICLES

import { PdfViewerModule } from "ng2-pdf-viewer";

import { AppChatBoxComponent } from "./app.chatbox.component";
import { AppHelpDeskBtnComponent } from "./app.helpdeskbtn.component";

import { MomentFormatPipe } from "./momentpipe";
import { TreeviewModule } from "ngx-treeview";
import { ScrollingModule } from '@angular/cdk/scrolling';

export function tokenGetter() {
    return localStorage.getItem("userInfo");
}
@NgModule({
    imports: [
        JwtModule.forRoot({
            config: {
                tokenGetter: tokenGetter,
                allowedDomains: ["example.com"],
                disallowedRoutes: ["http://example.com/examplebadroute/"],
            },
        }),
        TreeviewModule.forRoot(),
        BrowserModule,
        FormsModule,
        ScrollingModule,
        // ReactiveFormsModule,
        HttpClientModule,
        // // NgbModule.forRoot(),
        // // RouterModule.forRoot(appRoutes),
        // // MomentModule,
        // NgIdleKeepaliveModule.forRoot(),
        // ModalModule.forRoot(),
        // AngularFileUploaderModule,
        ReactiveFormsModule,
        AvatarModule,
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        AccordionModule,
        AutoCompleteModule,
        BreadcrumbModule,
        ButtonModule,
        CalendarModule,
        CardModule,
        CarouselModule,
        ChartModule,
        CheckboxModule,
        ChipsModule,
        CodeHighlighterModule,
        ConfirmDialogModule,
        ColorPickerModule,
        ContextMenuModule,
        DataViewModule,
        DialogModule,
        DropdownModule,
        FieldsetModule,
        FileUploadModule,
        FullCalendarModule,
        GalleriaModule,
        InplaceModule,
        InputNumberModule,
        InputMaskModule,
        InputSwitchModule,
        InputTextModule,
        InputTextareaModule,
        LightboxModule,
        ListboxModule,
        MegaMenuModule,
        MenuModule,
        MenubarModule,
        MessageModule,
        MessagesModule,
        MultiSelectModule,
        OrderListModule,
        OrganizationChartModule,
        OverlayPanelModule,
        PaginatorModule,
        PanelModule,
        PanelMenuModule,
        PasswordModule,
        PickListModule,
        ProgressBarModule,
        RadioButtonModule,
        RatingModule,
        RippleModule,
        ScrollPanelModule,
        SelectButtonModule,
        SidebarModule,
        SlideMenuModule,
        SliderModule,
        SplitButtonModule,
        StepsModule,
        TableModule,
        TabMenuModule,
        TabViewModule,
        TerminalModule,
        TieredMenuModule,
        ToastModule,
        ToggleButtonModule,
        ToolbarModule,
        TooltipModule,
        TreeModule,
        TreeTableModule,
        VirtualScrollerModule,
        AppCodeModule,
        IvyCarouselModule,
        BlockUIModule,
        ProgressSpinnerModule,
        GMapModule,
        EditorModule,

        NgxSkeletonLoaderModule,
        ImageCropperModule,
        PdfViewerModule,
        SafePipeModule,
        NgxYoutubePlayerModule,
        NgxYoutubePlayerModule.forRoot(),

        AngularFireDatabaseModule,
        AngularFireAuthModule,
        AngularFireMessagingModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
    ],
    declarations: [
        AppComponent,
        AppMainComponent,
        AppMenuComponent,
        AppMenuitemComponent,
        AppInlineProfileComponent,
        AppTopbarComponent,
        AppFooterComponent,
        AppRightpanelComponent,
        AppConfigComponent,
        AppBreadcrumbComponent,
        AppNotfoundComponent,
        AppErrorComponent,
        AppAccessdeniedComponent,
        AppLoginComponent,
        AppHelpComponent,
        AppInvoiceComponent,
        AppWizardComponent,

        AppComponent,
        LoginComponent,
        // DashboardComponent,
        // // TimeoutdialogComponent,
        // // TimeoutdialogService,
        // NavComponent,

        LoginComponent,
        DaftarPotensiComponent,
        DaftarPotensiModalComponent,
        DaftarPotensiDetailComponent,

        UsersComponent,
        GroupsComponent,
        MomentFormatPipe,
        // /////OTHERS
        ForgotPwdComponent,
        ResetPwdComponent,
        AppChatBoxComponent,
        AppHelpDeskBtnComponent,
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        MenuService,
        AppBreadcrumbService,


        AsyncPipe,
        {
            provide: HTTP_INTERCEPTORS,
            multi: true,
            useClass: ErrorInterceptor,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
