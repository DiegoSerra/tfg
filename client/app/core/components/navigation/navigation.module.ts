import { NgModule } from '@angular/core';
import { SharedModule } from '../../modules/shared.module';
import { RouterModule } from '@angular/router';
import { AppNavSubheaderComponent } from './nav-subheader/nav-subheader.component';
import { AppNavigationComponent } from './navigation.component';
import { AppNavItemComponent } from './nav-item/nav-item.component';
import { AppNavCollapseComponent } from './nav-collapse/nav-collapse.component';

@NgModule({
    imports     : [
        SharedModule,
        RouterModule
    ],
    exports     : [
        AppNavigationComponent
    ],
    declarations: [
        AppNavigationComponent,
        AppNavSubheaderComponent,
        AppNavItemComponent,
        AppNavCollapseComponent
    ]
})
export class AppNavigationModule
{
}
