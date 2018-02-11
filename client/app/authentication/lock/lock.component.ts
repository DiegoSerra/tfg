import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AppConfigService} from '../../core/services/config.service';
import { FormService } from '../../core/services/form.service';

@Component({
    selector: 'app-lock',
    templateUrl: './lock.component.html',
    styleUrls: ['./lock.component.scss']
})
export class AppLockComponent implements OnInit
{
    lockForm: FormGroup;
    lockFormErrors: any;

    constructor(
        private appConfig: AppConfigService,
        private formBuilder: FormBuilder
    )
    {
        this.appConfig.setSettings({
            layout: {
                navigation: 'none',
                toolbar   : 'none',
                footer    : 'none'
            }
        });

        this.lockFormErrors = {
            username: {},
            password: {}
        };
    }

    ngOnInit()
    {
        this.lockForm = this.formBuilder.group({
            username: [
                {
                    value   : 'Katherine',
                    disabled: true
                }, Validators.required
            ],
            password: ['', Validators.required]
        });

        this.lockForm.valueChanges.subscribe(() => {
            FormService.onFormValuesChanged(this.lockForm, this.lockFormErrors);
        });
    }

}
