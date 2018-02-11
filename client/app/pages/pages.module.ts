import { SharedModule } from '../core/modules/shared.module';
import { NgModule } from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import { PressReleaseComponent } from './press-release/press-release.component';
import { FrequentQuestionsComponent } from './frequent-questions/frequent-questions.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import {FooterComponent} from './shared/footer/footer.component';
import {LandingHeaderComponent} from './shared/header/header.component';
import {SidebarComponent} from './shared/sidebar/sidebar.component';
import {PagesComponent} from './pages.component';

const appRoutes: Route[] = [
  { path: 'content', component: PagesComponent, children: [
    { path: 'frequent-questions', component: FrequentQuestionsComponent },
    { path: 'press-release', component: PressReleaseComponent },
    { path: 'privacy-policy', component: PrivacyPolicyComponent },
    { path: 'terms-and-conditions', component: TermsAndConditionsComponent },
  ] }
];

@NgModule({
  declarations: [
    PressReleaseComponent,
    FrequentQuestionsComponent,
    TermsAndConditionsComponent,
    PrivacyPolicyComponent,
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
