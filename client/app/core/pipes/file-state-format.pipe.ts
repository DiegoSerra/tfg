import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileStateFormat'
})
export class FileStateFormatPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
      return value;
    }

    return value.replace(/\w\S*/g, (txt) => {
      switch (txt.toLowerCase()) {
        case 'n': return 'Archivo: Aún no se ha seleccionado ningún archivo...';
        case 'c': return 'Archivo: ' + args;
        case 'e': return 'Ha ocurrido un error. Revisa el archivo y vuelve a intentarlo';
        default: return value;
      }
    });
  }

}
