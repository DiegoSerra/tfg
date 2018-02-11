import {Component, OnInit, HostBinding} from '@angular/core';
import {
  AbstractControl,
  FormArray, FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors,
  Validators
} from '@angular/forms';
import {Router} from '@angular/router';

import 'rxjs/add/observable/zip';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';

import {RaceService} from '../../../../core/services/race.service';
import {Race} from '../../../../models/race.model';
import {Observable} from 'rxjs/Observable';

import {Animations} from '../../../../core/animations';


@Component({
  selector: 'app-create-race',
  templateUrl: './create-race.component.html',
  styleUrls: ['./create-race.component.scss'],
  animations: [Animations.slideToggle]
})
export class CreateRaceComponent implements OnInit {

  constructor(private router: Router,
              private raceService: RaceService) {
  }

  ngOnInit() {
  }
}
