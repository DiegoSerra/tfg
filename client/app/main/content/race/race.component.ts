import {Component, HostBinding, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import { Animations } from '../../../core/animations';

@Component({
  selector: 'app-content',
  templateUrl: './race.component.html',
  styleUrls: ['./race.component.scss'],
})
export class RaceComponent implements OnInit{

  constructor() {
  }

  ngOnInit() {
  }

}
