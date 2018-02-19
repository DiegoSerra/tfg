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
    const { googleSatellite, googleStreets, mapboxDark, baseMaps } = this.setLayersOnMap();
    
    const map = L.map('map', {layers: [googleSatellite, googleStreets, mapboxDark]});
    map.locate({setView: true, maxZoom: 100});
    
    const layersControl = L.control.layers(baseMaps, null, {collapsed: false, position: 'bottomright'}).addTo(map);

    const gpxLayer = omnivore.gpx(_map.gpx, null, null)
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

  setLayersOnMap() {
    const GOOGLE_TILES = 'http://{s}.google.com/vt/lyrs={type}&x={x}&y={y}&z={z}';
    const googleStreets = L.tileLayer(GOOGLE_TILES, {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      type: 'm'
    });
    const googleSatellite = L.tileLayer(GOOGLE_TILES, {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      type: 's'
    });
    const googleTerrain = L.tileLayer(GOOGLE_TILES, {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      type: 'p'
    });

    const mapboxDark = L.tileLayer('https://api.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      // tslint:disable-next-line:max-line-length
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.dark',
      accessToken: apiToken
    });
    const baseMaps = {
      'satellite': googleSatellite,
      'roadmap': googleStreets,
      'dark': mapboxDark
    };
    return { googleSatellite, googleStreets, mapboxDark, baseMaps };
  }
}

