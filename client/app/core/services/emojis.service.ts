import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs';


import { HttpClient } from '@angular/common/http';

@Injectable()
export class EmojisService {
  constructor(private http: HttpClient) {
  }

  all(): Observable<any> {
    return this.http.get(`assets/emojis/emoji.json`);
  }

  /* 
    Valid Categories:
      - animals
      - arrows
      - flags
      - others
      - smiles
      - stars
      - technology
      - vehicles
  */

  getByCategory(category): Observable<any> {
    return this.http.get(`assets/emojis/${category}.json`);
  }

  animals(): Observable<any> {
    return this.http.get(`assets/emojis/animals.json`);
  }

  arrows(): Observable<any> {
    return this.http.get(`assets/emojis/arrows.json`);
  }

  flags(): Observable<any> {
    return this.http.get(`assets/emojis/flags.json`);
  }

  others(): Observable<any> {
    return this.http.get(`assets/emojis/others.json`);
  }

  smiles(): Observable<any> {
    return this.http.get(`assets/emojis/smiles.json`);
  }

  stars(): Observable<any> {
    return this.http.get(`assets/emojis/stars.json`);
  }

  technology(): Observable<any> {
    return this.http.get(`assets/emojis/technology.json`);
  }

  vehicles(): Observable<any> {
    return this.http.get(`assets/emojis/vehicles.json`);
  }
}
