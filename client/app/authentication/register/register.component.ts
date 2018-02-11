import {PasswordValidation} from '../services/password-validation';
import {Component, OnInit} from '@angular/core';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppConfigService} from '../../core/services/config.service';
import {UserService} from '../../core/services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormService} from '../../core/services/form.service';

import 'rxjs/add/operator/first';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../authentication.scss', './register.component.scss']
})
export class AppRegisterComponent implements OnInit {
  registerForm: FormGroup;
  registerFormErrors: any;
  checked = false;
  clicked = false;
  repeatedEmail = false;

  params: any;

  constructor(private appConfig: AppConfigService,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private route: ActivatedRoute,
              private router: Router) {


    this.appConfig.setSettings({
      layout: {
        navigation: 'none',
        toolbar: 'none',
        footer: 'none'
      }
    });

    this.registerFormErrors = {
      name: {},
      email: {},
      password: {},
      passwordConfirm: {}
    };
  }

  ngOnInit() {

    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required],
      terms: ['', Validators.required],
    }, {
      validator: PasswordValidation.PasswordRequirements
      // validator: [PasswordValidation.MatchPassword, PasswordValidation.PasswordRequirements]
    });

    this.registerForm.valueChanges.subscribe(() => {
      FormService.onFormValuesChanged(this.registerForm, this.registerFormErrors);
    });
  }

  register() {
    this.route.queryParams
      .first()
      .subscribe(queryParams => {
        if (this.checked) {
          this.userService
            .create(this.registerForm.value, queryParams)
            .subscribe(
              (response) => {
                this.userService.me();
                if (response.redirectPath) {
                  this.router.navigateByUrl(response.redirectPath);
                } else {
                  this.router.navigate(['/', 'app']);
                }
              },
              (error) => {
                this.repeatedEmail = true;
              });
        } else {
          this.clicked = true;
        }
      });
  }

  displayRequeriments(str) {
    return PasswordValidation.displayRequeriments(str);
  }
}
