import {NgModule} from '@angular/core';
import {SharedModule} from '../../../core/modules/shared.module';
import {Route, RouterModule} from '@angular/router';
import {ContentGuard} from '../content.guard';
import {CalendarComponent} from './calendar.component';
import {CalendarModule} from 'angular-calendar';
import {CalendarService} from './calendar.service';
import {AppCalendarEventFormDialogComponent} from './event-form/event-form.component';

const routes = [
  {
    path: '',
    component: CalendarComponent,
    canActivate: [ContentGuard]
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    CalendarModule.forRoot()
  ],
  declarations: [
    CalendarComponent,
    AppCalendarEventFormDialogComponent,
  ],
  providers: [CalendarService],
  entryComponents: [AppCalendarEventFormDialogComponent]
})
export class AppCalendarModule { }
