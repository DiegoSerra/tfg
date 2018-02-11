import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../../../core/services/user.service';
import {User} from '../../../../../models/user.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-profile-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AppProfileAboutComponent implements OnInit {
  user: User;
  editing = false;
  totalReferrals = 0;
  url: string;

  form: FormGroup;

  constructor(private userService: UserService) {
    userService.user$.subscribe((user: User) => {
      this.user = user;
      this.form = new FormGroup({
        name: new FormControl(user.name, Validators.required),
        description: new FormControl(user.description, Validators.required),
        email: new FormControl(user.email, Validators.required),
        gender: new FormControl(user.gender, Validators.required),
        phone: new FormControl(user.phone),
        birthdate: new FormControl(user.birthdate),
        occupation: new FormControl(user.occupation)
      });
    });
  }

  ngOnInit() {
    this.editing = false;
  }

  edit() {
    this.editing = true;
  }

  cancel() {
    this.form.reset({
      name: this.user.name,
      description: this.user.description,
      email: this.user.email,
      gender: this.user.gender,
      phone: this.user.phone,
      birthdate: this.user.birthdate,
      occupation: this.user.occupation
    });
    this.editing = false;
  }

  save() {
    const observables = [];

    const nameControl = this.form.get('name');
    if (nameControl.dirty) {
      const name = nameControl.value;
      observables.push(this.userService.changeName(name));
    }

    const emailControl = this.form.get('email');
    if (emailControl.dirty) {
      const email = emailControl.value;
      observables.push(this.userService.changeEmail(email));
    }

    const userForm = this.form.value;
    delete userForm.name;
    delete userForm.email;
    observables.push(this.userService.updateUser(userForm));

    Observable
      .forkJoin(...observables)
      .subscribe(result => {
        this.userService.me();
        this.editing = false;
      });
  }
}
