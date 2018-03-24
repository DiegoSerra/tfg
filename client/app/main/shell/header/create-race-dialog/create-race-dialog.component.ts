import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {FileUploader, FileItem, ParsedResponseHeaders} from 'ng2-file-upload';
import {MapService} from '../../../../core/services/map.service';
import { FormService } from '../../../../core/services/form.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


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
  
  raceForm: FormGroup;
  raceFormErrors: any;

  constructor(public dialogRef: MatDialogRef<CreateRaceDialogComponent>,
              private mapService: MapService,
              private formBuilder: FormBuilder) {
    this.mapService.getMapNames()
      .subscribe((files: any) => {
        this.tracks = files;
      });

    this.raceFormErrors = {
      track: {}
    };
  }

  ngOnInit() {
    this.raceForm = this.formBuilder.group({
      track: ['', Validators.required],
      race: []
    });

    this.raceForm.valueChanges.subscribe(() => {
        FormService.onFormValuesChanged(this.raceForm, this.raceFormErrors);
    });

    this.uploaderImportFile = new FileUploader({url: `api/race/import`});
    this.uploaderImportFile.onSuccessItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      this.fileState = 'c';
      this.file = item.file.name;
      this.raceForm.get('race').setValue(JSON.parse(response));
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
