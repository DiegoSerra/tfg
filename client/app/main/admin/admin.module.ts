import {NgModule} from '@angular/core';
import {AdminGuard} from './admin.guard';
import {AdminComponent} from './admin.component';
import {Route, RouterModule} from '@angular/router';
import {SharedModule} from '../../core/modules/shared.module';

import {UserComponent} from './user/user.component';
import {RaceComponent} from './race/race.component';
import {MapComponent} from './maps/map.component';
import {FileUploadModule} from 'ng2-file-upload';

const routes: Route[] = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: 'users',
        component: UserComponent
      },
      {
        path: 'races',
        component: RaceComponent
      },
      {
        path: 'maps',
        component: MapComponent
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/admin/sample'
      }
    ]
  },
];

@NgModule({
  declarations: [
    AdminComponent,
    UserComponent,
    RaceComponent,
    MapComponent,
  ],
  entryComponents: [

  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    FileUploadModule,
  ],
  providers: [
    AdminGuard,
  ]

})
export class AdminModule { }
