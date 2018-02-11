import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lastWeek'
})
export class LastWeekPipe implements PipeTransform {

  transform(value: any, args1: any, args2?: any): any {
    if (!value) {
      return 0;
    }
    const lastWeekData = value.filter(data => {
      const dataCreateOnDate = args2 ? new Date(data[args1][args2]).getTime() : new Date(data[args1]).getTime();
      const lastWeek = new Date().setDate(new Date().getDate() - 7);
      return dataCreateOnDate > lastWeek;
    });
    return lastWeekData.length;
  }

}
