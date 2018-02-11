import {Component, Input, OnInit} from '@angular/core';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppConfigService} from '../../core/services/config.service';
import {User} from '../../models/user.model';
import {UserService} from '../../core/services/user.service';
import {MatSnackBar} from '@angular/material';
import { FormService } from '../../core/services/form.service';
import {environment} from '../../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../authentication.scss', './login.component.scss']
})
export class AppLoginComponent implements OnInit {
  loginForm: FormGroup;
  loginFormErrors: any;
  isProduction: boolean;

  constructor(private appConfig: AppConfigService,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private snackBar: MatSnackBar,
              private route: ActivatedRoute,
              private router: Router) {
    this.appConfig.setSettings({
      layout: {
        navigation: 'none',
        toolbar: 'none',
        footer: 'none'
      }
    });

    this.loginFormErrors = {
      email: {},
      password: {}
    };

    this.isProduction = environment.production;
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.loginForm.valueChanges.subscribe(() => {
      FormService.onFormValuesChanged(this.loginForm, this.loginFormErrors);
    });
  }

  login() {
    this.userService.login(this.loginForm.value, window.location.search)
      .subscribe(
        (result) => {
          this.userService.me();
          window.location.href = result.redirectPath || '/app';
        },
        (error) => {
          this.snackBar.open('Usuario o contraseña incorrecto', '', {duration: 5000});
        });
  }
}
