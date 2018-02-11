import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../modules/shared.module';
import { AppSearchBarComponent } from './search-bar.component';

@NgModule({
    declarations: [
        AppSearchBarComponent
    ],
    imports     : [
        SharedModule,
        RouterModule
    ],
    exports     : [
        AppSearchBarComponent
    ]
})
export class AppSearchBarModule
{
}
