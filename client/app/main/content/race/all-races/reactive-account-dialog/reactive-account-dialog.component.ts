import {Component, OnInit, Inject, HostListener} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {UserService} from '../../../../../core/services/user.service';
import {Router} from '@angular/router';
import {User} from '../../../../../models/user.model';

const REACTIVE_TIMEOUT = 900000;

@Component({
  selector: 'app-reactive-account-dialog',
  templateUrl: './reactive-account-dialog.component.html',
  styleUrls: ['./reactive-account-dialog.component.scss']
})
export class ReactiveAccountDialogComponent implements OnInit {

  user: User;

  constructor(public dialogRef: MatDialogRef<ReactiveAccountDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private userService: UserService,
              private router: Router) {
    userService.user$.subscribe((user: User) => {
      this.user = user;
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.userService.logout(() => {
        this.router.navigate(['/auth/login']);
        this.dialogRef.close();
      });
    }, REACTIVE_TIMEOUT);
  }

  @HostListener('window:beforeunload')
  beforeunloadHandler() {
    this.userService.logout(() => {
      this.router.navigate(['/auth/login']);
      this.dialogRef.close();
    });
  }

  logout() {
    this.userService.logout(() => {
      this.router.navigate(['/auth/login']);
      this.dialogRef.close();
    });
  }

  reactivate() {
    this.userService.activate(this.user)
      .subscribe(() => {
        this.dialogRef.close();
      });
  }

}
