import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs';



import {Race} from '../../models/race.model';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class RaceService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get(`api/race`);
  }

  all() {
    return this.http.get(`api/race/me`);
  }

  myCalendar() {
    return this.http.get(`api/race/calendar`);
  }

  getOne(raceId) {
    return this.http.get(`api/race/${raceId}`);
  }

  create(race: Race): Observable<any> {
    return this.http.post(`api/race`, race);
  }

  update(race: Race): Observable<any> {
    return this.http.put(`api/race/${race._id}`, race);
  }

  getOpportumeeties(raceId: string) {
    return this.http.get(`api/race/${raceId}/opportumeeties`);
  }

  requestMatch(participantId: string, fromRace: string, toRace: string, pts: Object) {
    return this.http.post(`api/race/request`, {participants: [participantId], fromRace, toRace, pts });
  }

  remove(raceId: string) {
    return this.http.delete(`api/race/${raceId}`);
  }

}
