import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable ,  Subject } from 'rxjs';
import { Http } from '@angular/http';

@Injectable()
export class CalendarService implements Resolve<any> {
  events: any;
  onEventsUpdated = new Subject<any>();

  constructor(private http: Http) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      Promise.all([
        this.getEvents()
      ]).then(
        ([events]: [any]) => {
          resolve();
        },
        reject
      );
    });
  }

  getEvents() {
    return new Promise((resolve, reject) => {

      this.http.get('api/race/calendar')
        .subscribe((response: any) => {
          this.events = response.json();
          this.onEventsUpdated.next(this.events);
          resolve(this.events);
        }, reject);
      });
  }

  updateEvents(events) {
    this.events = events;
  }

  createEvent(event) {
    return new Promise((resolve, reject) => {
      this.http.post(`api/race`, event)
        .subscribe((response: any) => {
          this.getEvents();
        }, reject);
    });
  }

  deleteEvent(event) {
    return new Promise((resolve, reject) => {
      this.http.delete(`api/race/${event.info._id}`)
        .subscribe((response: any) => {
          return response;
        }, reject);
    });
  }
}
