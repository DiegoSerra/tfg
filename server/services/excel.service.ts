import * as mongoose from 'mongoose';
import * as Excel from 'exceljs';
import * as tmp from 'tmp-promise';

import {TimeService} from './time.service';
import * as _ from 'lodash';

export class ExcelService {

  private static DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  private static HEADER_COLOR = 'eeece1';

  private static printCell(cell, color: string) {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: color}
    };
    cell.font = {
      bold: true
    };
    cell.border = {
      top: {style: 'thin'},
      left: {style: 'thin'},
      bottom: {style: 'thin'},
      right: {style: 'thin'}
    };

  }

  static getRaceFromExcel(file) {
    return new Promise((resolve, reject) => {
      const workbook = new Excel.Workbook();
      const results = [];

      return workbook.xlsx.readFile(file)
        .then(() => {
          // Fill Basic Race Result info
          const worksheet = workbook.getWorksheet(1);

          // Iterate all Rows (Stations)
          worksheet.eachRow((row, rowNumber: number) => {

            // Skip first Row (Table Header)
            if (rowNumber > 1) {
              // Get Position (First Column)
              const position = +row.getCell(1).value;
              // Get Time (Second  Column)
              const time = row.getCell(2).value;
              // Get Rhythm (Third  Column)
              const rhythm = row.getCell(3).value;
              // Get Dorsal (Fourth  Column)
              const dorsal = +row.getCell(4).value;
              // Get Runner Name (Fifth Column)
              const runnerName = _.isObject(row.getCell(5).value) ? row.getCell(5).text : row.getCell(5).value;
              // Get Position Category (Six Column)
              const positionCategory = +row.getCell(6).value;
              // Get Full category (Seventh Column)
              const fullCategory = row.getCell(7).value;
              // Get category
              const category = fullCategory.split('-')[0] || 'Anónimo';
              // Get gender
              const gender = fullCategory.split('-')[1] || 'Anónimo';
              // Get Club (Eighth Column)       
              const club = row.getCell(8).value;  
              
              results.push({
                position,
                time,
                rhythm,
                dorsal,
                runnerName,
                positionCategory,
                fullCategory,
                category,
                gender,
                club
              });
            }
          });
          resolve(results);
        })
        .catch(reject);
    });
  }

}
