import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {AgmCoreModule} from '@agm/core';

import {MaterialModule} from './material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ColorPickerModule} from 'ngx-color-picker';
import {NgxDnDModule} from '@swimlane/ngx-dnd';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';

import {MomentModule} from 'angular2-moment';

import {
  AppMatSidenavHelperDirective,
  AppMdSidenavTogglerDirective
} from '../directives/mat-sidenav-helper/mat-sidenav-helper.directive';
import {AppPipesModule} from '../pipes/pipes.module';
import {AppConfirmDialogComponent} from '../components/confirm-dialog/confirm-dialog.component';
import {AppCountdownComponent} from '../components/countdown/countdown.component';
import {AppNavigationService} from '../components/navigation/navigation.service';
import {AppMatchMedia} from '../services/match-media.service';
import {AppNavbarService} from '../../main/shell/navbar/navbar.service';
import {AppMatSidenavHelperService} from '../directives/mat-sidenav-helper/mat-sidenav-helper.service';
import {AppHljsComponent} from '../components/hljs/hljs.component';
import {AppIfOnDomDirective} from '../directives/app-if-on-dom/app-if-on-dom.directive';
import {AppMaterialColorPickerComponent} from '../components/material-color-picker/material-color-picker.component';
import {EqualValidatorDirective} from '../directives/equal-validator/equal-validator.directive';
import {AppGoogleMapsWidgetComponent} from '../components/google-maps-widget/google-maps-widget.component';
import {environment} from '../../../environments/environment';
import {TextMaskModule} from 'angular2-text-mask';
import {AppHeaderComponent} from '../../main/shell/header/header.component';
import {RouterModule} from '@angular/router';
import {FileUploadModule} from 'ng2-file-upload';
import {MapComponent} from '../../main/shell/map/map.component';
import { CreateRaceDialogComponent } from '../../main/shell/header/create-race-dialog/create-race-dialog.component';

@NgModule({
  declarations: [
    AppMatSidenavHelperDirective,
    AppMdSidenavTogglerDirective,
    AppConfirmDialogComponent,
    AppCountdownComponent,
    AppHljsComponent,
    AppIfOnDomDirective,
    AppMaterialColorPickerComponent,
    AppGoogleMapsWidgetComponent,
    EqualValidatorDirective,
    AppHeaderComponent,
    MapComponent,
    CreateRaceDialogComponent
  ],
  imports: [
    RouterModule,
    FileUploadModule,
    FlexLayoutModule,
    MaterialModule,
    CommonModule,
    FormsModule,
    AppPipesModule,
    ReactiveFormsModule,
    ColorPickerModule,
    NgxDnDModule,
    NgxDatatableModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleApi,
      libraries: ['places'],
      language: 'es',
    }),
    TextMaskModule,
    MomentModule,
  ],
  exports: [
    FlexLayoutModule,
    MaterialModule,
    CommonModule,
    FormsModule,
    AppMatSidenavHelperDirective,
    AppMdSidenavTogglerDirective,
    AppPipesModule,
    AppCountdownComponent,
    AppHljsComponent,
    ReactiveFormsModule,
    ColorPickerModule,
    NgxDnDModule,
    NgxDatatableModule,
    AppIfOnDomDirective,
    AppMaterialColorPickerComponent,
    AppGoogleMapsWidgetComponent,
    EqualValidatorDirective,
    TextMaskModule,
    MomentModule,
    AppHeaderComponent,
    MapComponent,
  ],
  entryComponents: [
    AppConfirmDialogComponent,
    CreateRaceDialogComponent
  ],
  providers: [
    AppNavigationService,
    AppMatchMedia,
    AppNavbarService,
    AppMatSidenavHelperService
  ]
})

export class SharedModule {

}
