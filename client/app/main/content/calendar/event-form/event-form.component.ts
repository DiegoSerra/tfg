import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CalendarEvent } from 'angular-calendar';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CalendarEventModel } from '../event.model';
import { TimeService } from '../../../../time.service';

@Component({
    selector     : 'app-calendar-event-form-dialog',
    templateUrl  : './event-form.component.html',
    styleUrls    : ['./event-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class AppCalendarEventFormDialogComponent implements OnInit
{
    timeMask = [/[0-2]/, /[0-9]/, ':', /[0-5]/, /[0-9]/, ':', /[0-5]/, /[0-9]/];
    rhythmMask = [/[0-2]/, /[0-9]/, ':', /[0-5]/, /[0-9]/];

    event: any;
    dialogTitle: string;
    eventForm: FormGroup;
    action: string;

    alreadyDone = false;

    constructor(
        public dialogRef: MatDialogRef<AppCalendarEventFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private formBuilder: FormBuilder,
        private timeService: TimeService
    )
    {
        this.event = data.event;
        this.action = data.action;

        if ( this.action === 'edit' || this.action === 'view' )
        {
            this.dialogTitle = this.event.title;
        }
        else
        {
            this.dialogTitle = 'Nueva carrera';
            this.event = new CalendarEventModel({
                start: data.date,
                end  : data.date,
                color: {
                    primary: '#e3bc08',
                    secondary: '#FDF1BA'
                }
            });
        }

        this.eventForm = this.createEventForm();

        this.alreadyDone = new Date() > new Date(this.event.end);
    }

    ngOnInit()
    {
    }

    createEventForm()
    {
        return new FormGroup({
            title : new FormControl(this.event.title),
            kms : new FormControl(this.event.kms),
            time : new FormControl(),
            rhythm : new FormControl(),
            start : new FormControl(this.event.info && this.event.info.start || this.event.start),
            startTime : new FormControl(this.event.info && this.timeService.dateToFullHourString(this.event.info.start) || this.timeService.dateToFullHourString(this.event.start)),
            end   : new FormControl(this.event.info && this.event.info.end || this.event.end),
            endTime   : new FormControl(this.event.info && this.timeService.dateToFullHourString(this.event.info.end) || this.timeService.dateToFullHourString(this.event.end)),
            color : this.formBuilder.group({
                primary  : new FormControl(this.event.color.primary),
                secondary: new FormControl(this.event.color.secondary)
            })           
        });
    }
}
