import {Component, OnInit, HostBinding} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';
import {Race} from '../../../../models/race.model';
import {RaceService} from '../../../../core/services/race.service';
import {UserService} from '../../../../core/services/user.service';
import {User} from '../../../../models/user.model';
import {tileLayer, latLng, geoJSON, Layer, circle, polygon, marker, icon} from 'leaflet';

@Component({
  selector: 'app-show-race',
  templateUrl: './show-race.component.html',
  styleUrls: ['./show-race.component.scss']
})
export class ShowRaceComponent implements OnInit {
  me: User;

  race: Race = <Race>{};

  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoom: 5,
    center: latLng(46.879966, -121.726909)
  };
  layer = marker([ 46.879966, -121.726909 ], {
    icon: icon({
       iconSize: [ 25, 41 ],
       iconAnchor: [ 13, 41 ],
       iconUrl: 'assets/marker-icon.png',
       shadowUrl: 'assets/marker-shadow.png'
    })
  });
  layersControl = {
    baseLayers: {
      'Open Street Map': tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }),
      'Open Cycle Map': tileLayer('http://{s}.tile.opencyclemap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    },
    overlays: {
      'Big Circle': circle([ 46.95, -122 ], { radius: 5000 }),
      'Big Square': polygon([[ 46.8, -121.55 ], [ 46.9, -121.55 ], [ 46.9, -121.7 ], [ 46.8, -121.7 ]])
    }
  };


  constructor(private userService: UserService,
              private route: ActivatedRoute,
              private raceService: RaceService,
              private router: Router) {
  }

  ngOnInit() {
    this.userService.user$
      .subscribe((me: User) => {
        this.me = me;
      });

    this.route.data.subscribe((data) => {
      this.race = data.race;
    });
  }

}
