import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'genderFormat'
})
export class GenderFormatPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
      return value;
    }

    return value.replace(/\w\S*/g, (txt) => {
      switch (txt.toLowerCase()) {
        case 'm': return 'Hombre';
        case 'f': return 'Mujer';
        default: return value;
      }
    });
  }

}
