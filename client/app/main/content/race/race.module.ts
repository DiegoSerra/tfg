import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';

import {RaceComponent} from './race.component';
import {ShowRaceComponent} from './show-race/show-race.component';
import {CreateRaceComponent} from './create-race/create-race.component';
import {AllRacesComponent} from './all-races/all-races.component';
import {SharedModule} from '../../../core/modules/shared.module';
import {RaceResolve} from './race.resolve';
import {ContentGuard} from '../content.guard';
import {DialogComponent} from './dialog/dialog.component';
import {EditRaceComponent} from './edit-race/edit-race.component';
import {DeleteRaceDialogComponent} from './all-races/delete-race-dialog/delete-race-dialog.component';
import {ReactiveAccountDialogComponent} from './all-races/reactive-account-dialog/reactive-account-dialog.component';
import {AppMainModule} from '../../main.module';
import { SummaryComponent } from './show-race/summary/summary.component';
import { ClassifiedsComponent } from './show-race/classifieds/classifieds.component';
import { AnalysisComponent } from './show-race/analysis/analysis.component';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import { AppWidgetModule } from '../../../core/components/widget/widget.module';

const routes: Route[] = [
  {
    path: '',
    canActivate: [ContentGuard],
    children: [
      {
        path: 'view/:id',
        component: ShowRaceComponent,
        resolve: {
          race: RaceResolve
        }
      }, {
        path: 'create',
        component: CreateRaceComponent
      }, {
        path: 'edit/:id',
        component: EditRaceComponent
      },
      {
        path: 'all',
        component: AllRacesComponent
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'app/race/all'
      }
    ]
  }
];

@NgModule({
  declarations: [
    RaceComponent,
    ShowRaceComponent,
    CreateRaceComponent,
    AllRacesComponent,
    DialogComponent,
    DeleteRaceDialogComponent,
    EditRaceComponent,
    ReactiveAccountDialogComponent,
    SummaryComponent,
    ClassifiedsComponent,
    AnalysisComponent,
  ],
  entryComponents: [
    DialogComponent,
    DeleteRaceDialogComponent,
    ReactiveAccountDialogComponent
  ],
  imports: [
    SharedModule,
    AppWidgetModule,
    RouterModule.forChild(routes),
    NgxChartsModule
  ],
  providers: [
    RaceResolve
  ]
})

export class RaceModule {

}
