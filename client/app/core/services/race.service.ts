import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/map';

import {Race} from '../../models/race.model';

@Injectable()
export class RaceService {

  constructor(private http: Http) { }

  getAll() {
    return this.http.get(`api/race`)
      .map((result: Response) => {
        return result.json();
      });
  }

  all() {
    return this.http.get(`api/race/me`)
      .map((result: Response) => {
        return result.json();
      });
  }

  getOne(raceId) {
    return this.http.get(`api/race/${raceId}`)
      .map((result: Response) => {
        return result.json();
      });
  }

  create(race: Race): Observable<any> {
    return this.http.post(`api/race`, race)
      .map((result: Response) => {
        return result.json();
      });
  }

  update(race: Race): Observable<any> {
    return this.http.put(`api/race/${race._id}`, race)
      .map((result: Response) => {
        return result.json();
      });
  }

  getOpportumeeties(raceId: string) {
    return this.http.get(`api/race/${raceId}/opportumeeties`)
      .map((result: Response) => {
        return result.json();
      });
  }

  requestMatch(participantId: string, fromRace: string, toRace: string, pts: Object) {
    return this.http.post(`api/race/request`, {participants: [participantId], fromRace, toRace, pts })
      .map((result: Response) => {
        return result.json();
      });
  }

  remove(raceId: string) {
    return this.http.delete(`api/race/${raceId}`)
      .map((result: Response) => {
        return result;
      });
  }

}
