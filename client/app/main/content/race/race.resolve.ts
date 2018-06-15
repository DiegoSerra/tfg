import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {RaceService} from '../../../core/services/race.service';

@Injectable()
export class RaceResolve implements Resolve<any> {

  constructor(private raceService: RaceService) {
  }


  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.raceService.getOne(route.params['id']);
  }

}
