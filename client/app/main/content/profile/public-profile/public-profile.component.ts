import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {User} from '../../../../models/user.model';
import {UserService} from '../../../../core/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.scss']
})
export class PublicProfileComponent implements OnInit {
  user: User;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute) {
    route.params
      .subscribe((params: any) => {
        const userId = params.userId;
        userService.getUserProfile(userId)
          .subscribe(userInfo => {
            this.user = userInfo;
          });
      });
  }

  ngOnInit() {
  }
}
