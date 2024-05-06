import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { AppMainComponent } from "./app.main.component";
import { AppNotfoundComponent } from "./pages/app.notfound.component";
import { AppErrorComponent } from "./pages/app.error.component";
import { AppAccessdeniedComponent } from "./pages/app.accessdenied.component";
import { AppLoginComponent } from "./pages/app.login.component";
import { AuthGuardService } from "./Services/auth-guard.service";
import { AdminGuardService } from "./Services/admin-guard.service";
import { AdminPendataanGuardService } from "./Services/admin-pendataan-guard.service";
import { LoginComponent } from "./login/login.component";

import { DaftarPotensiComponent } from "./main/daftarpotensi/daftarpotensi.component";
import { DaftarPotensiDetailComponent } from "./main/daftarpotensi/detail/daftarpotensi_detail.component";

import { UsersComponent } from "./others/users/users.component";
import { GroupsComponent } from "./others/groups/groups.component";

////FORGOT PWD
import { ForgotPwdComponent } from "./others/forgot-pwd/forgot-pwd.component";
import { ResetPwdComponent } from "./others/reset-pwd/reset-pwd.component";


// =======

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                { path: "", pathMatch: "full", redirectTo: "/admin" },
                { path: "login", component: LoginComponent },
                {
                    path: "admin",
                    component: AppMainComponent,
                    canActivate: [AuthGuardService],
                    children: [

                        {
                            path: "daftarpotensi",
                            component: DaftarPotensiComponent,
                        },
                        {
                            path: "daftarpotensi_det/:header_id",
                            component: DaftarPotensiDetailComponent,
                        },

                        /////USERS
                        {
                            path: "users",
                            component: UsersComponent,
                        },
                        {
                            path: "groups",
                            component: GroupsComponent,
                        },

                    ],
                },
                /////EXECUTIVE
                // { path: "boss", redirectTo: "/executive" },
                { path: "forgot-pwd", component: ForgotPwdComponent },
                { path: "reset-pwd", component: ResetPwdComponent },

                { path: "error", component: AppErrorComponent },
                { path: "access", component: AppAccessdeniedComponent },
                { path: "notfound", component: AppNotfoundComponent },
                // { path: 'wizard', component: AppWizardComponent },
                { path: "**", redirectTo: "/notfound" },
            ],
            { scrollPositionRestoration: "enabled", anchorScrolling: "enabled" }
        ),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
