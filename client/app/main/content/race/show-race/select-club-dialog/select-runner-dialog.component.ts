import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Validators, FormBuilder, FormGroup, ValidationErrors, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-select-runner-dialog',
  templateUrl: './select-runner-dialog.component.html',
  styleUrls: ['./select-runner-dialog.component.scss']
})
export class SelectRunnerDialogComponent implements OnInit {

  form: FormGroup;

  runners: any[] = [];
  filteredRunners: Observable<any>;

  constructor(public dialogRef: MatDialogRef<SelectRunnerDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      runner: ['', [Validators.required, this.isObject]]
    });

    this.runners = this.data.race.results || [];

    this.filteredRunners = this.form.get('runner').valueChanges
      .debounceTime(400)
      .map(runnerName => {
        return runnerName ? this.filterRunner(runnerName) : this.runners.slice();
      });
  }

  filterRunner(runnerInput): any[] {
    const runnerName = typeof runnerInput === 'string' ? runnerInput : runnerInput.runnerName;
    const filteredRunners = this.runners.filter(runner => {
      return runnerName && runner.runnerName && runner.runnerName.toLowerCase().indexOf(runnerName.toLowerCase()) !== -1;
    });
    return filteredRunners;
  }

  displayName(runner): any {
    return runner ? runner.runnerName : runner;
  }

  isObject(control: AbstractControl): ValidationErrors | null {
    return typeof control.value !== 'object' ? {isNotAnObject: true} : null;
  }
}
