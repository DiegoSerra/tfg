import { Component, OnInit, Input } from '@angular/core';
import { TimeService } from '../../../../../time.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss']
})
export class AnalysisComponent implements OnInit {

  @Input() race: any;

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  rhythm = [];
  info = [];
  categorys = [];
  genders = [];

  constructor(private timeService: TimeService) { }
  
  ngOnInit() {
    this.rhythm = [
      {
        'name': '< 4:00',
        'value': 
          this.race.results.filter(result => 
            this.timeService.stringRhythmToFullSeconds(result.rhythm) < 240
          ).length
      },
      {
        'name': '4:00 - 4:30',
        'value': 
          this.race.results.filter(result => 
            this.timeService.stringRhythmToFullSeconds(result.rhythm) >= 240 && this.timeService.stringRhythmToFullSeconds(result.rhythm) < 270
          ).length
      },
      {
        'name': '4:30 - 5:00',
        'value': 
          this.race.results.filter(result => 
            this.timeService.stringRhythmToFullSeconds(result.rhythm) >= 270 && this.timeService.stringRhythmToFullSeconds(result.rhythm) < 300
          ).length
      },
      {
        'name': '5:00 - 5:30',
        'value': 
          this.race.results.filter(result => 
            this.timeService.stringRhythmToFullSeconds(result.rhythm) >= 300 && this.timeService.stringRhythmToFullSeconds(result.rhythm) < 330
          ).length
      },
      {
        'name': '5:30 - 6:00',
        'value': 
          this.race.results.filter(result => 
            this.timeService.stringRhythmToFullSeconds(result.rhythm) >= 330 && this.timeService.stringRhythmToFullSeconds(result.rhythm) < 360
          ).length
      },
      {
        'name': '6:00 - 6:30',
        'value': 
          this.race.results.filter(result => 
            this.timeService.stringRhythmToFullSeconds(result.rhythm) >= 360 && this.timeService.stringRhythmToFullSeconds(result.rhythm) < 390
          ).length
      },
      {
        'name': '6:30 - 7:00',
        'value': 
          this.race.results.filter(result => 
            this.timeService.stringRhythmToFullSeconds(result.rhythm) >= 390 && this.timeService.stringRhythmToFullSeconds(result.rhythm) < 420
          ).length
      },
      {
        'name': '> 7:00',
        'value': 
          this.race.results.filter(result => 
            this.timeService.stringRhythmToFullSeconds(result.rhythm) >= 450
          ).length
      },
    ];

    const clubTypes = _.uniq(this.race.results.map(result => result.club));
    this.info = [
      {
        'name': 'Corredores',
        'value': this.race.results.length
      },
      {
        'name': 'Kilometros',
        'value': this.race.kms
      },
      {
        'name': 'Clubes',
        'value': clubTypes.length
      }
    ];

    const categoryTypes = _.uniq(this.race.results.map(result => result.category));
    categoryTypes.forEach(category => {
      this.categorys.push({name: category, value: this.race.results.filter(result => result.category === category).length});
    });

    this.genders = [
      {
        'name': 'Hombre',
        'value': this.race.results.filter(result => result.gender === 'M').length
      },
      {
        'name': 'Mujer',
        'value': this.race.results.filter(result => result.gender === 'F').length
      }
    ];
  }

}
