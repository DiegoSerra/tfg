import {Component, OnInit} from '@angular/core';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppConfigService} from '../../core/services/config.service';
import {UserService} from '../../core/services/user.service';
import {ActivatedRoute} from '@angular/router';
import {PasswordValidation} from './../services/password-validation';
import { FormService } from '../../core/services/form.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class AppResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  resetPasswordFormErrors: any;

  constructor(
    private userService: UserService,
    private appConfig: AppConfigService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute) {
    this.appConfig.setSettings({
      layout: {
        navigation: 'none',
        toolbar: 'none',
        footer: 'none'
      }
    });

    this.resetPasswordFormErrors = {
      password: {},
      passwordConfirm: {}
    };
  }

  ngOnInit() {
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required]
    }, {
      Validators: PasswordValidation.PasswordRequirements
    });

    this.resetPasswordForm.valueChanges.subscribe(() => {
      FormService.onFormValuesChanged(this.resetPasswordForm, this.resetPasswordFormErrors);
    });
  }

  resetPassword() {
    const queryParams = this.activatedRoute.snapshot.queryParams;
    this.userService.resetPassword(queryParams.token, this.resetPasswordForm.value.password)
      .subscribe(result => {
        this.userService.me();
        window.location.href = result.redirectPath;
      });
  }

  displayRequeriments(str) {
    return PasswordValidation.displayRequeriments(str);
  }

}
