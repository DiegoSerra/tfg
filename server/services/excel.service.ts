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
      const race: any = {};

      return workbook.xlsx.readFile(file)
        .then(() => {
          // Fill Basic Race info with the Summary Sheet
          const summarySheet = workbook.getWorksheet('Summary');
          race.name = summarySheet.getRow(1).getCell(2).value;      
          race.dateStart = summarySheet.getRow(2).getCell(2).value;  
          race.hourStart = summarySheet.getRow(3).getCell(2).value;
          race.city = summarySheet.getRow(4).getCell(2).value;
          race.country = summarySheet.getRow(5).getCell(2).value;
          race.kms = +summarySheet.getRow(6).getCell(2).value;

          // Fill Basic Race Result info
          const worksheet = workbook.getWorksheet('Results');
          race.results = [];

          // Iterate all Rows (Stations)
          worksheet.eachRow((row, rowNumber: number) => {

            // Skip first Row (Table Header)
            if (rowNumber > 1) {
              // Get Position (First Column)
              const position = +row.getCell(1).value;
              // Get Runner Name (Second Column)
              const runnerName = row.getCell(2).value;
              // Get Gender (Third Column)
              const gender = row.getCell(3).value;
              // Get Age (Fourth  Column)
              const age = row.getCell(4).value;
              // Get Time (Fifth  Column)
              const time = row.getCell(5).value;
              // Get Rhythm (Sixth  Column)
              const rhythm = row.getCell(6).value;
              race.results.push({
                position,
                runnerName,
                gender,
                age,
                time,
                rhythm
              });
            }
          });
          resolve(race);
        })
        .catch(reject);
    });
  }

}
