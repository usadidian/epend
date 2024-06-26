/* tslint:disable:no-unused-variable */

import {async, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AppComponent} from './app.component';
import {AppMainComponent} from './app.main.component';
import {AppConfigComponent} from './app.config.component';
import {AppTopbarComponent} from './app.topbar.component';
import {AppRightpanelComponent} from './app.rightpanel.component';
import {AppInlineProfileComponent} from './app.profile.component';
import {AppFooterComponent} from './app.footer.component';
import {AppBreadcrumbComponent} from './app.breadcrumb.component';
import {AppMenuComponent} from './app.menu.component';
import {AppBreadcrumbService} from './app.breadcrumb.service';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {TabViewModule} from 'primeng/tabview';

describe('AppComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, ScrollPanelModule, TabViewModule],
            declarations: [AppComponent,
                AppMainComponent,
                AppConfigComponent,
                AppTopbarComponent,
                AppMenuComponent,
                AppFooterComponent,
                AppBreadcrumbComponent,
                AppInlineProfileComponent,
                AppRightpanelComponent
            ],
            providers: [AppBreadcrumbService]
        });
        TestBed.compileComponents();
    });

    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
});
