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
  saving = false;
  totalReferrals = 0;
  url: string;

  form: FormGroup;
  percentage: Number;

  constructor(private userService: UserService) {
    userService.user$.subscribe((user: User) => {
      this.user = user;
      this.form = new FormGroup({
        name: new FormControl(user.name, Validators.required),
        description: new FormControl(user.description),
        email: new FormControl(user.email, Validators.required),
        gender: new FormControl(user.gender),
        phone: new FormControl(user.phone),
        birthdate: new FormControl(user.birthdate),
        occupation: new FormControl(user.occupation)
      });
    });

    // CALCULATE COMPLETE PERCENTAGE
    const keys = Object.keys(this.form.controls);
    const length = keys.length;
    let valid = keys.filter(control => !!this.form.controls[control].value);
    this.percentage = valid.length / length;

    this.form.valueChanges.subscribe(val => {
      valid = keys.filter(control => !!this.form.controls[control].value);
      this.percentage = valid.length / length;
    });
    // END CALCULATE COMPLETE PERCENTAGE
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
    this.saving = true;
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
        this.saving = false;
      });
  }
}
