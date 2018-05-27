import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SummaryComponent implements OnInit {

  @Input() race: any;
  clubTypes: any[];

  constructor() { }

  ngOnInit() {
    this.clubTypes = _.uniq(this.race.results.map(result => result.club));
  }

}
