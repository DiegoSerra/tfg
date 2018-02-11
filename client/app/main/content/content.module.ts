import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {SharedModule} from '../../core/modules/shared.module';

const routes: Route[] = [
  {
    path: 'race',
    loadChildren: './race/race.module#RaceModule'
  },
  {
    path: 'chat',
    loadChildren: './chat/chat.module#AppChatModule'
  },
  {
    path: 'profile',
    loadChildren: './profile/profile.module#ProfileModule'
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/app/race/all'
  },
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class ContentModule {
}
