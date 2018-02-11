import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'occupationFormat'
})
export class OccupationFormatPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
      return value;
    }
    
    return value.replace(/\w\S*/g, (txt) => {
      switch (value) {
        case 'Student': return 'Estudiante';
        case 'Businessman': return 'Empresario';
        case 'Entrepreneur': return 'Emprendedor';
        case 'Employee': return 'Empleado';
        case 'Unemployee': return 'Desempleado';
        default: return value;
      }
    });
  }

}
