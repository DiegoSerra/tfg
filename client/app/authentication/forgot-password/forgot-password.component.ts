import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppConfigService} from '../../core/services/config.service';
import {UserService} from '../../core/services/user.service';
import { FormService } from '../../core/services/form.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class AppForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  forgotPasswordFormErrors: any;

  sendedEmail = false;

  constructor(private appConfig: AppConfigService,
              private formBuilder: FormBuilder,
              private userService: UserService) {
    this.appConfig.setSettings({
      layout: {
        navigation: 'none',
        toolbar: 'none',
        footer: 'none'
      }
    });

    this.forgotPasswordFormErrors = {
      email: {}
    };
  }

  ngOnInit() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.forgotPasswordForm.valueChanges.subscribe(() => {
      FormService.onFormValuesChanged(this.forgotPasswordForm, this.forgotPasswordFormErrors);
    });
  }

  resetPasswordHandler() {
    this.sendedEmail = true;
    this.userService.forgotPassword(this.forgotPasswordForm.value['email'])
      .subscribe( result => {

    });
  }
}
