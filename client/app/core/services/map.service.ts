import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../../environments/environment';

import 'rxjs/add/operator/map';

import {Map} from '../../models/map.model';

const apiToken = environment.mapbox;
declare const omnivore: any;
declare const L: any;

const defaultCoords: number[] = [40, -80];
const defaultZoom = 8;

@Injectable()
export class MapService {

  constructor(private http: Http) { }

  getAll() {
    return this.http.get(`api/map`)
      .map((result: Response) => {
        return result.json();
      });
  }

  all() {
    return this.http.get(`api/map/me`)
      .map((result: Response) => {
        return result.json();
      });
  }

  getOne(mapId) {
    return this.http.get(`api/map/${mapId}`)
      .map((result: Response) => {
        return result.json();
      });
  }

  getOneByRace(raceId) {
    return this.http.get(`api/map/race/${raceId}`)
      .map((result: Response) => {
        return result.json();
      });
  }

  create(map: Map): Observable<any> {
    return this.http.post(`api/map`, map)
      .map((result: Response) => {
        return result.json();
      });
  }

  update(map: Map): Observable<any> {
    return this.http.put(`api/map/${map._id}`, map)
      .map((result: Response) => {
        return result.json();
      });
  }

  plotActivity(_map) {
    const myStyle = {
      'color': '#3949AB',
      'weight': 5,
      'opacity': 0.95
    };

    const map = L.map('map').setView(defaultCoords, defaultZoom);

    map.maxZoom = 100;

    L.tileLayer('https://api.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      // tslint:disable-next-line:max-line-length
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.dark',
      accessToken: apiToken
    }).addTo(map);

    const customLayer = L.geoJson(null, {
      style: myStyle
    });

    const gpxLayer = omnivore.gpx(_map.gpxData, null, customLayer)
    .on('ready', function() {
      map.fitBounds(gpxLayer.getBounds());
    }).addTo(map);
  }

  getMapNames() {
    return this.http.get(`api/map/files`)
      .map((result: Response) => {
        return result.json();
      });
  }
}
