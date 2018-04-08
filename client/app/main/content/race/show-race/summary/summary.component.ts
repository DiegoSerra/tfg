import { Component, OnInit, Input } from '@angular/core';
import _ = require('lodash');

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  @Input() race: any;
  clubTypes: any[];

  constructor() { }

  ngOnInit() {
    this.clubTypes = _.uniq(this.race.results.map(result => result.club));
  }

}
