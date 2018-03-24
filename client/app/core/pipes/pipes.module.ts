import {NgModule} from '@angular/core';

import {KeysPipe} from './keys.pipe';
import {GetByIdPipe} from './getById.pipe';
import {HtmlToPlaintextPipe} from './htmlToPlaintext.pipe';
import {FilterPipe} from './filter.pipe';
import {CamelCaseToDashPipe} from './camelCaseToDash.pipe';
import {TzSystemPipe} from './tzSystem.pipe';
import { OccupationFormatPipe } from './occupation-format.pipe';
import { GenderFormatPipe } from './gender-format.pipe';
import { LastWeekPipe } from './last-week.pipe';
import { TodayPipe } from './today.pipe';
import { FileStateFormatPipe } from './file-state-format.pipe';
import { EmojiFilterPipe } from './emoji-filter.pipe';
import { SecondsToTimePipe } from './secondsToTime.pipe';

@NgModule({
  declarations: [
    KeysPipe,
    GetByIdPipe,
    HtmlToPlaintextPipe,
    FilterPipe,
    CamelCaseToDashPipe,
    TzSystemPipe,
    OccupationFormatPipe,
    GenderFormatPipe,
    LastWeekPipe,
    TodayPipe,
    FileStateFormatPipe,
    EmojiFilterPipe,
    SecondsToTimePipe
  ],
  imports: [],
  exports: [
    KeysPipe,
    GetByIdPipe,
    HtmlToPlaintextPipe,
    FilterPipe,
    CamelCaseToDashPipe,
    TzSystemPipe,
    OccupationFormatPipe,
    GenderFormatPipe,
    LastWeekPipe,
    TodayPipe,
    FileStateFormatPipe,
    EmojiFilterPipe,
    SecondsToTimePipe
  ]
})

export class AppPipesModule {

}
