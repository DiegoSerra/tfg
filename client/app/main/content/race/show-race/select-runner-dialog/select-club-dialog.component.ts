import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Validators, FormBuilder, FormGroup, ValidationErrors, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {debounceTime, map} from 'rxjs/operators';
import * as _ from 'lodash';


@Component({
  selector: 'app-select-club-dialog',
  templateUrl: './select-club-dialog.component.html',
  styleUrls: ['./select-club-dialog.component.scss']
})
export class SelectClubDialogComponent implements OnInit {

  form: FormGroup;

  runners: any[] = [];
  clubs: any[] = [];
  filteredClubs: Observable<any>;

  constructor(public dialogRef: MatDialogRef<SelectClubDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      club: ['', [Validators.required]]
    });

    this.runners = this.data.race.results || [];
    this.clubs = _.uniq(this.runners.map(result => result.club));

    this.filteredClubs = this.form.get('club').valueChanges
      .pipe(
        debounceTime(400),
        map(name => {
          return name ? this.filterClub(name) : this.clubs.slice();
        })
      );
  }

  filterClub(clubInput): any[] {
    const filteredClubs = this.clubs.filter(club => {
      return clubInput && club && club.toLowerCase().indexOf(clubInput.toLowerCase()) !== -1;
    });
    return filteredClubs;
  }
}
