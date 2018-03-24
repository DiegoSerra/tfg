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
    event: any;
    dialogTitle: string;
    eventForm: FormGroup;
    action: string;

    constructor(
        public dialogRef: MatDialogRef<AppCalendarEventFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private formBuilder: FormBuilder,
        private timeService: TimeService
    )
    {
        this.event = data.event;
        this.action = data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = this.event.title;
        }
        // else
        // {
        //     this.dialogTitle = 'New Event';
        //     this.event = new CalendarEventModel({
        //         start: data.date,
        //         end  : data.date
        //     });
        // }

        this.eventForm = this.createEventForm();
    }

    ngOnInit()
    {
    }

    createEventForm()
    {
        return new FormGroup({
            title : new FormControl(this.event.title),
            start : new FormControl(this.event.start),
            startTime : new FormControl(this.timeService.dateToFullHourString(this.event.start)),
            end   : new FormControl(this.event.end),
            endTime   : new FormControl(this.timeService.dateToFullHourString(this.event.end)),
        });
    }
}
