import {Injectable, Pipe, PipeTransform} from '@angular/core';
import {TimeService} from '../../time.service';

@Injectable()
@Pipe({name: 'tzSystem'})
export class TzSystemPipe implements PipeTransform {

  constructor(private timeService: TimeService){}

  transform(date: Date, args: any[] = []) {
    return this.timeService.dateToSystemMoment(date);
  }
}
