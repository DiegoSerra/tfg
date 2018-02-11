import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {SharedModule} from '../core/modules/shared.module';

import {AppMainComponent} from './main.component';
import {AppContentComponent} from './content/content.component';
import {AppFooterComponent} from './shell/footer/footer.component';
import {AppNavbarComponent} from './shell/navbar/navbar.component';
import {AppToolbarComponent} from './shell/toolbar/toolbar.component';
import {AppNavigationModule} from '../core/components/navigation/navigation.module';
import {AppNavbarToggleDirective} from './shell/navbar/navbar-toggle.directive';
import {AppQuickPanelComponent} from './shell/quick-panel/quick-panel.component';
import {AppThemeOptionsComponent} from '../core/components/theme-options/theme-options.component';
import {AppShortcutsModule} from '../core/components/shortcuts/shortcuts.module';
import {AppSearchBarModule} from '../core/components/search-bar/search-bar.module';
import {ChatSocketio} from './content/chat/chat.socketio';

import {FileUploadModule} from 'ng2-file-upload';

const routes = [
  {
    path: '',
    component: AppMainComponent,
    children: [
      {
        path: '',
        loadChildren: './content/content.module#ContentModule'
      },
      {
        path: 'admin',
        loadChildren: './admin/admin.module#AdminModule'
      }
    ]
  }
];

@NgModule({
  declarations: [
    AppContentComponent,
    AppFooterComponent,
    AppMainComponent,
    AppNavbarComponent,
    AppToolbarComponent,
    AppNavbarToggleDirective,
    AppThemeOptionsComponent,
    AppQuickPanelComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    AppNavigationModule,
    AppShortcutsModule,
    AppSearchBarModule,
    FileUploadModule,
  ],
  exports: [
    AppMainComponent
  ],
  providers: [ChatSocketio]
})

export class AppMainModule {
}
