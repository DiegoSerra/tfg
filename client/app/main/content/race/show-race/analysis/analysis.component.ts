import { Component, OnInit, Input } from '@angular/core';
import { TimeService } from '../../../../../time.service';
import * as _ from 'lodash';
import { BreakpointObserver } from '@angular/cdk/layout';

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

  genderTypes: any[];
  categoryTypes: any[];
  categoryGenderTypes: any[];

  rhythm = [];
  genderRhythm = [];
  categoryRhythm = [];
  categoryGenderRhythm = [];
  info = [];
  categorys = [];
  genders = [];

  constructor(private timeService: TimeService, private breakpointObserver: BreakpointObserver) { }
  
  ngOnInit() {
    this.genderTypes = _.uniq(this.race.results.map(result => result.gender));
    this.categoryTypes = _.uniq(this.race.results.map(result => result.category));
    this.categoryGenderTypes = _.uniq(this.race.results.map(result => result.fullCategory));
    
    this.rhythm = this.getRhythmResults();
    
    this.categorys = this.getCategoryResults();

    this.genderRhythm = this.getGenderRhythmResults();

    this.categoryGenderRhythm = this.getCategoryGenderRhythmResults();

    this.categoryRhythm = this.getCategoryRhythmResults();

    this.genders = this.getGenderResults();
  }

  get isMobile() {
    return this.breakpointObserver.isMatched('(max-width: 600px)');
  }

  get isTablet() {
    return this.breakpointObserver.isMatched('(max-width: 876px)');
  }
  
  getRhythmResults() {
    return [
      {
        'name': '< 4:00',
        'value': this.race.results.filter(result => result.rhythm < 240).length
      },
      {
        'name': '4:00 - 4:30',
        'value': this.race.results.filter(result => result.rhythm >= 240 && result.rhythm < 270).length
      },
      {
        'name': '4:30 - 5:00',
        'value': this.race.results.filter(result => result.rhythm >= 270 && result.rhythm < 300).length
      },
      {
        'name': '5:00 - 5:30',
        'value': this.race.results.filter(result => result.rhythm >= 300 && result.rhythm < 330).length
      },
      {
        'name': '5:30 - 6:00',
        'value': this.race.results.filter(result => result.rhythm >= 330 && result.rhythm < 360).length
      },
      {
        'name': '6:00 - 6:30',
        'value': this.race.results.filter(result => result.rhythm >= 360 && result.rhythm < 390).length
      },
      {
        'name': '6:30 - 7:00',
        'value': this.race.results.filter(result => result.rhythm >= 390 && result.rhythm < 420).length
      },
      {
        'name': '> 7:00',
        'value': this.race.results.filter(result => result.rhythm >= 450).length
      },
    ];
  }
  
  getCategoryResults() {
    const categorys = [];
    this.categoryTypes.forEach(category => {
      categorys.push({name: category, value: this.race.results.filter(result => result.category === category).length});
    });
    return categorys;
  }
  
  getGenderRhythmResults() {
    const genderRhythm = [];
    this.genderTypes.forEach(gender => {
      genderRhythm.push(
        {
          name: gender, 
          series: [
            {
              'name': '< 4:00',
              'value': this.race.results.filter(result => result.rhythm < 240 && result.gender === gender).length
            },
            {
              'name': '4:00 - 4:30',
              'value': this.race.results.filter(result => result.rhythm >= 240 && result.rhythm < 270 && result.gender === gender).length
            },
            {
              'name': '4:30 - 5:00',
              'value': this.race.results.filter(result => result.rhythm >= 270 && result.rhythm < 300 && result.gender === gender).length
            },
            {
              'name': '5:00 - 5:30',
              'value': this.race.results.filter(result => result.rhythm >= 300 && result.rhythm < 330 && result.gender === gender).length
            },
            {
              'name': '5:30 - 6:00',
              'value': this.race.results.filter(result => result.rhythm >= 330 && result.rhythm < 360 && result.gender === gender).length
            },
            {
              'name': '6:00 - 6:30',
              'value': this.race.results.filter(result => result.rhythm >= 360 && result.rhythm < 390 && result.gender === gender).length
            },
            {
              'name': '6:30 - 7:00',
              'value': this.race.results.filter(result => result.rhythm >= 390 && result.rhythm < 420 && result.gender === gender).length
            },
            {
              'name': '> 7:00',
              'value': this.race.results.filter(result => result.rhythm >= 450 && result.gender === gender).length
            },
          ]
        }
      );
    });
    return genderRhythm;
  }

  getCategoryGenderRhythmResults() {
    const categoryGenderRhythm = [];
    this.categoryGenderTypes.forEach(fullCategory => {
      categoryGenderRhythm.push(
        {
          name: fullCategory, 
          series: [
            {
              'name': '< 4:00',
              'value': this.race.results.filter(result => result.rhythm < 240 && result.fullCategory === fullCategory).length
            },
            {
              'name': '4:00 - 4:30',
              'value': this.race.results.filter(result => result.rhythm >= 240 && result.rhythm < 270 && result.fullCategory === fullCategory).length
            },
            {
              'name': '4:30 - 5:00',
              'value': this.race.results.filter(result => result.rhythm >= 270 && result.rhythm < 300 && result.fullCategory === fullCategory).length
            },
            {
              'name': '5:00 - 5:30',
              'value': this.race.results.filter(result => result.rhythm >= 300 && result.rhythm < 330 && result.fullCategory === fullCategory).length
            },
            {
              'name': '5:30 - 6:00',
              'value': this.race.results.filter(result => result.rhythm >= 330 && result.rhythm < 360 && result.fullCategory === fullCategory).length
            },
            {
              'name': '6:00 - 6:30',
              'value': this.race.results.filter(result => result.rhythm >= 360 && result.rhythm < 390 && result.fullCategory === fullCategory).length
            },
            {
              'name': '6:30 - 7:00',
              'value': this.race.results.filter(result => result.rhythm >= 390 && result.rhythm < 420 && result.fullCategory === fullCategory).length
            },
            {
              'name': '> 7:00',
              'value': this.race.results.filter(result => result.rhythm >= 450 && result.fullCategory === fullCategory).length
            },
          ]
        }
      );
    });
    return categoryGenderRhythm;
  }
  
  getCategoryRhythmResults() {
    const categoryRhythm = [];
    this.categoryTypes.forEach(category => {
      categoryRhythm.push(
        {
          name: category, 
          series: [
            {
              'name': '< 4:00',
              'value': this.race.results.filter(result => result.rhythm < 240 && result.category === category).length
            },
            {
              'name': '4:00 - 4:30',
              'value': this.race.results.filter(result => result.rhythm >= 240 && result.rhythm < 270 && result.category === category).length
            },
            {
              'name': '4:30 - 5:00',
              'value': this.race.results.filter(result => result.rhythm >= 270 && result.rhythm < 300 && result.category === category).length
            },
            {
              'name': '5:00 - 5:30',
              'value': this.race.results.filter(result => result.rhythm >= 300 && result.rhythm < 330 && result.category === category).length
            },
            {
              'name': '5:30 - 6:00',
              'value': this.race.results.filter(result => result.rhythm >= 330 && result.rhythm < 360 && result.category === category).length
            },
            {
              'name': '6:00 - 6:30',
              'value': this.race.results.filter(result => result.rhythm >= 360 && result.rhythm < 390 && result.category === category).length
            },
            {
              'name': '6:30 - 7:00',
              'value': this.race.results.filter(result => result.rhythm >= 390 && result.rhythm < 420 && result.category === category).length
            },
            {
              'name': '> 7:00',
              'value': this.race.results.filter(result => result.rhythm >= 450 && result.category === category).length
            },
          ]
        }
      );
    });
    return categoryRhythm;
  }

  getGenderResults() {
    return [
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
