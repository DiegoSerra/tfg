import {Component, OnInit, HostBinding, OnDestroy} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';
import {Race} from '../../../../models/race.model';
import {RaceService} from '../../../../core/services/race.service';
import {UserService} from '../../../../core/services/user.service';
import {User} from '../../../../models/user.model';
import {TrackService} from '../../../../core/services/track.service';

@Component({
  selector: 'app-show-race',
  templateUrl: './show-race.component.html',
  styleUrls: ['./show-race.component.scss']
})
export class ShowRaceComponent implements OnInit, OnDestroy {
  me: User;

  race: Race = <Race>{};
  
  constructor(private userService: UserService,
              private route: ActivatedRoute,
              private raceService: RaceService,
              private trackService: TrackService,
              private router: Router) {

    userService.user$.subscribe((me: User) => this.me = me);
  
    this.route.data.subscribe((data) => {
      this.race = data.race;
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.trackService.clearGeoJson();
  }

}
