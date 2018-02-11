import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppShortcutsComponent } from './shortcuts.component';
import { SharedModule } from '../../modules/shared.module';

@NgModule({
    declarations: [
        AppShortcutsComponent
    ],
    imports     : [
        SharedModule,
        RouterModule
    ],
    exports     : [
        AppShortcutsComponent
    ]
})
export class AppShortcutsModule
{
}
