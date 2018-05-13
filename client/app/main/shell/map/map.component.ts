import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MapService } from '../../../core/services/map.service';
import { Map } from '../../../models/map.model';
import { TrackService } from '../../../core/services/track.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {

  @Input() race: any;

  map: Map;

  constructor(private mapService: MapService, public trackService: TrackService) { }

  ngOnInit() {
    this.mapService.getOneByRace(this.race._id)
      .subscribe((map: any) => {
        this.map = map;
        this.trackService.plotActivity(this.map, this.race);
      });
  }

  ngOnDestroy() {
    // this.trackService.clearGeoJson();
  }

}
