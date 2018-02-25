import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/map';

import {Map} from '../../models/map.model';

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
  
  getMapNames() {
    return this.http.get(`api/map/files`)
      .map((result: Response) => {
        return result.json();
      });
  }
}

