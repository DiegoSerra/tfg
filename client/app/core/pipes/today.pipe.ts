import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'today'
})
export class TodayPipe implements PipeTransform {

  transform(value: any, args1: any, args2?: any): any {
    if (!value) {
      return 0;
    }
    
    const yesterdayData = value.filter(data => {
      const dataCreateOnDate = args2 ? new Date(data[args1][args2]).getTime() : new Date(data[args1]).getTime();
      const yesterday = new Date().setDate(new Date().getDate() - 1);
      return dataCreateOnDate > yesterday;
    });
    return yesterdayData.length;
  }

}
