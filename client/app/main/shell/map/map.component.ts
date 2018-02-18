import { Component, OnInit, Input } from '@angular/core';
import { MapService } from '../../../core/services/map.service';
import { Map } from '../../../models/map.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  @Input() race: any;

  map: Map;

  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.mapService.getOneByRace(this.race._id)
      .subscribe(map => {
        this.map = map;
        this.mapService.plotActivity(this.map);
      });
  }

}
