import { Component, OnInit, Input, ViewEncapsulation, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import { TrackService } from '../../../../../core/services/track.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SummaryComponent implements OnInit, OnDestroy {

  @Input() race: any;
  private _sliderFormatValue = 0;

  clubTypes: any[];
  
  sliderValue = 0;
  replayState = 'pause';
  timer: any;

  numSteps: number;
  runnerView = 0;
  runnerValue = 0;

  onNumStepsChanged: Subscription;
  onRunnerViewChanged: Subscription;
  onRunnerValueChanged: Subscription;

  constructor(private trackService: TrackService) { }
  
  ngOnInit() {
    this.clubTypes = _.uniq(this.race.results.map(result => result.club));

    this.onNumStepsChanged =
      this.trackService.onNumStepsChange.subscribe(numSteps => this.numSteps = numSteps);

    this.onRunnerViewChanged =
      this.trackService.onRunnerViewChange.subscribe(runnerView => this.runnerView = runnerView);

    this.onRunnerValueChanged =
      this.trackService.onRunnerValueChange.subscribe(runnerValue => this.runnerValue = runnerValue);
  }

  get silderFormatValue() {
    return TrackService.format(this._sliderFormatValue * 60);
  }

  sliderInput(event?) {
    const value = event ? event.value : this.sliderValue;
    const offset = Math.floor(this.getFinishTime(this.race) / (this.numSteps - 1));
    this.trackService.changeOfSliderLayer(value, offset);
    this._sliderFormatValue = value;
  }

  getFinishTime(race) {
    const totalTimes = race.results.map((result) => result.time);
    const lastClassifiedTime = Math.max(...totalTimes);
    return lastClassifiedTime;
  }

  replay() {
    this.sliderValue--;
    this.sliderInput();
  }

  forward() {
    this.sliderValue++;
    this.sliderInput();
  }

  playReplay() {
    this.replayState = 'play';
    this.timer = setInterval(() => {
      if (this.sliderValue < this.numSteps - 1) {
        this.sliderValue++;
        this.sliderInput();
      } else {
        clearInterval(this.timer);
        this.sliderValue = 0;
        this.replayState = 'pause';
        this.sliderInput();
      }
    }, 100);
  }

  pauseReplay() {
    this.replayState = 'pause';
    clearInterval(this.timer);
  }

  ngOnDestroy() {
    this.onNumStepsChanged.unsubscribe();
    this.onRunnerViewChanged.unsubscribe();
    this.onRunnerValueChanged.unsubscribe();
    clearInterval(this.timer);
  }
}
