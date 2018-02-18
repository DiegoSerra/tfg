import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {FileUploader, FileItem, ParsedResponseHeaders} from 'ng2-file-upload';
import {MapService} from '../../../../core/services/map.service';


@Component({
  selector: 'app-create-race-dialog',
  templateUrl: './create-race-dialog.component.html',
  styleUrls: ['./create-race-dialog.component.scss']
})
export class CreateRaceDialogComponent implements OnInit {

  uploaderImportFile: FileUploader;
  fileState = 'n';
  file: any;
  tracks = [];

  constructor(public dialogRef: MatDialogRef<CreateRaceDialogComponent>, private mapService: MapService) {
    this.mapService.getAll()
      .subscribe(maps => {
        this.tracks = maps.map(map => {
          const file = map.gpx.split('/')[map.gpx.length - 1];
          return file;
        });
      });
  }

  ngOnInit() {
    this.uploaderImportFile = new FileUploader({url: `api/race/import`});
    this.uploaderImportFile.onSuccessItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      this.fileState = 'c';
      this.file = item.file.name;
    };
    this.uploaderImportFile.onErrorItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      this.fileState = 'e';
    };
  }

  importFile() {
    this.uploaderImportFile.setOptions({url: `api/race/import`});
    setTimeout(() => {
      this.uploaderImportFile.uploadAll();
    });
  }

}
