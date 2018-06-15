import {Component, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormArray, FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';





import {RaceService} from '../../../../core/services/race.service';
import {Observable} from 'rxjs';

import {TimeService} from '../../../../time.service';
import {ErrorStateMatcher} from '@angular/material/core';

import {MatDialog} from '@angular/material';
import {DialogComponent} from '../dialog/dialog.component';
import {Animations} from '../../../../core/animations';
import {ArrayService} from '../../../../array.service';
import {Race} from '../../../../models/race.model';

@Component({
  selector: 'app-edit-race',
  templateUrl: './edit-race.component.html',
  styleUrls: ['./edit-race.component.scss'],
  animations: [Animations.slideToggle]
})
export class EditRaceComponent implements OnInit {

  race: Race;

  constructor(private router: Router,
              private raceService: RaceService,
              private dialog: MatDialog,
              private route: ActivatedRoute) {

  }

  openDialog() {
    this.dialog.open(DialogComponent);
  }


  ngOnInit() {
    this.raceService.getOne(this.route.snapshot.params['id'])
      .subscribe((race: any) => {
        this.race = race;
      });
  }

}
