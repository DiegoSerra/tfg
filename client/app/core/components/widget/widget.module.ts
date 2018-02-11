import { NgModule } from '@angular/core';
import { SharedModule } from '../../modules/shared.module';
import { AppWidgetComponent } from './widget.component';
import { AppWidgetToggleDirective } from './widget-toggle.directive';

@NgModule({
    imports     : [
        SharedModule
    ],
    exports     : [
        AppWidgetComponent,
        AppWidgetToggleDirective
    ],
    declarations: [
        AppWidgetComponent,
        AppWidgetToggleDirective
    ]
})
export class AppWidgetModule
{
}
