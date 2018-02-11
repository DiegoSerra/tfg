import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppChatComponent} from './chat.component';
import {ChatService} from './chat.service';
import {AppChatViewComponent} from './chat-view/chat-view.component';
import {AppChatStartComponent} from './chat-start/chat-start.component';
import {AppChatChatsSidenavComponent} from './sidenavs/left/chats/chats.component';
import {AppChatUserSidenavComponent} from './sidenavs/left/user/user.component';
import {AppChatLeftSidenavComponent} from './sidenavs/left/left.component';
import {AppChatRightSidenavComponent} from './sidenavs/right/right.component';
import {AppChatContactSidenavComponent} from './sidenavs/right/contact/contact.component';
import {SharedModule} from '../../../core/modules/shared.module';
import {ContentGuard} from '../content.guard';

const routes: Routes = [
  {
    path: '**',
    component: AppChatComponent,
    canActivate: [ContentGuard],
    children: [],
    resolve: {
      chat: ChatService
    }
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    AppChatComponent,
    AppChatViewComponent,
    AppChatStartComponent,
    AppChatChatsSidenavComponent,
    AppChatUserSidenavComponent,
    AppChatLeftSidenavComponent,
    AppChatRightSidenavComponent,
    AppChatContactSidenavComponent
  ],
  providers: [
    ChatService   
  ]
})
export class AppChatModule {
}
