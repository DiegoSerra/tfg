import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/map';

import {Map} from '../../models/map.model';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MapService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get(`api/map`);
  }

  all() {
    return this.http.get(`api/map/me`);
  }

  getOne(mapId) {
    return this.http.get(`api/map/${mapId}`);
  }

  getOneByRace(raceId) {
    return this.http.get(`api/map/race/${raceId}`);
  }

  create(map: Map): Observable<any> {
    return this.http.post(`api/map`, map);
  }

  update(map: Map): Observable<any> {
    return this.http.put(`api/map/${map._id}`, map);
  }
  
  getMapNames() {
    return this.http.get(`api/map/files`);
  }
}

