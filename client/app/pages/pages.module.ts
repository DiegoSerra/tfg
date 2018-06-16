import { SharedModule } from '../core/modules/shared.module';
import { NgModule } from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {FooterComponent} from './shared/footer/footer.component';
import {LandingHeaderComponent} from './shared/header/header.component';
import {SidebarComponent} from './shared/sidebar/sidebar.component';
import {PagesComponent} from './pages.component';

const appRoutes: Route[] = [
];

@NgModule({
  declarations: [
    FooterComponent,
    LandingHeaderComponent,
    SidebarComponent,
    PagesComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(appRoutes)
  ],
  exports: [
    FooterComponent,
    LandingHeaderComponent,
    SidebarComponent
  ],
})
export class PagesModule { }
