import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {PrivateProfileComponent} from './private-profile/private-profile.component';
import {AppProfileAboutComponent} from './private-profile/about/about.component';
import {ProfileService} from './profile.service';
import {SharedModule} from '../../../core/modules/shared.module';
import {ContentGuard} from '../content.guard';
import {PublicProfileComponent} from './public-profile/public-profile.component';
import {FileUploadModule} from 'ng2-file-upload';

const routes: Routes = [
  {
    path: '',
    component: PrivateProfileComponent,
    canActivate: [ContentGuard],
    pathMatch: 'full'
  }, {
    path: ':userId',
    component: PublicProfileComponent,
    canActivate: [ContentGuard]
  }
];

@NgModule({
  declarations: [
    AppProfileAboutComponent,
    PublicProfileComponent,
    PrivateProfileComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    FileUploadModule,
  ],
  providers: [
    ProfileService
  ]
})
export class ProfileModule {
}
