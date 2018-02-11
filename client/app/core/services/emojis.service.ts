import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class EmojisService {
  constructor(private http: Http) {
  }

  all(): Observable<any> {
    return this.http.get(`assets/emojis/emoji.json`)
      .map((result: Response) => {
        return result.json();
      })
      .catch((error: any) => {
        return error;
      });
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
    return this.http.get(`assets/emojis/${category}.json`)
      .map((result: Response) => {
        return result.json();
      })
      .catch((error: any) => {
        return error;
      });
  }

  animals(): Observable<any> {
    return this.http.get(`assets/emojis/animals.json`)
      .map((result: Response) => {
        return result.json();
      })
      .catch((error: any) => {
        return error;
      });
  }

  arrows(): Observable<any> {
    return this.http.get(`assets/emojis/arrows.json`)
      .map((result: Response) => {
        return result.json();
      })
      .catch((error: any) => {
        return error;
      });
  }

  flags(): Observable<any> {
    return this.http.get(`assets/emojis/flags.json`)
      .map((result: Response) => {
        return result.json();
      })
      .catch((error: any) => {
        return error;
      });
  }

  others(): Observable<any> {
    return this.http.get(`assets/emojis/others.json`)
      .map((result: Response) => {
        return result.json();
      })
      .catch((error: any) => {
        return error;
      });
  }

  smiles(): Observable<any> {
    return this.http.get(`assets/emojis/smiles.json`)
      .map((result: Response) => {
        return result.json();
      })
      .catch((error: any) => {
        return error;
      });
  }

  stars(): Observable<any> {
    return this.http.get(`assets/emojis/stars.json`)
      .map((result: Response) => {
        return result.json();
      })
      .catch((error: any) => {
        return error;
      });
  }

  technology(): Observable<any> {
    return this.http.get(`assets/emojis/technology.json`)
      .map((result: Response) => {
        return result.json();
      })
      .catch((error: any) => {
        return error;
      });
  }

  vehicles(): Observable<any> {
    return this.http.get(`assets/emojis/vehicles.json`)
      .map((result: Response) => {
        return result.json();
      })
      .catch((error: any) => {
        return error;
      });
  }
}
