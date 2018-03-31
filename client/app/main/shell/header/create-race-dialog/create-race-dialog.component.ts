import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {FileUploader, FileItem, ParsedResponseHeaders} from 'ng2-file-upload';
import {MapService} from '../../../../core/services/map.service';
import { FormService } from '../../../../core/services/form.service';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';


@Component({
  selector: 'app-create-race-dialog',
  templateUrl: './create-race-dialog.component.html',
  styleUrls: ['./create-race-dialog.component.scss']
})
export class CreateRaceDialogComponent implements OnInit {

  mask = [/[0-2]/, /[0-9]/, ':', /[0-5]/, /[0-9]/];
  hourPattern = '^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$';

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
      name: {},
      kms: {},
      track: {},
      dateStart: {},
      hourStart: {},
      dateEnd: {},
      hourEnd: {}
    };
  }

  ngOnInit() {
    this.raceForm = this.formBuilder.group({    
      track: ['', Validators.required],    
      race: this.formBuilder.group({
        name: ['', Validators.required],
        kms: ['', Validators.required],
        dateStart: ['', [Validators.required, this.isDate]],
        hourStart: ['', [Validators.required]],
        dateEnd: ['', [Validators.required, this.isDate]],
        hourEnd: ['', [Validators.required]],
        results: []
      })
    });

    this.raceForm.valueChanges.subscribe(() => {
        FormService.onFormValuesChanged(this.raceForm, this.raceFormErrors);
    });

  }

  isDate(control: AbstractControl): ValidationErrors | null {
    if (control.value && control.value.getDate) {
      return null;
    }
    return {isNotADate: true};
  }

}
