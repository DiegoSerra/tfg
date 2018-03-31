import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarMonthViewDay
} from 'angular-calendar';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subject } from 'rxjs/Subject';
import { CalendarService } from './calendar.service';
import { CalendarEventModel } from './event.model';
import { Animations } from '../../../core/animations';
import { AppConfirmDialogComponent } from '../../../core/components/confirm-dialog/confirm-dialog.component';
import { AppCalendarEventFormDialogComponent } from './event-form/event-form.component';
import { FormGroup } from '@angular/forms';
import { User } from '../../../models/user.model';
import { UserService } from '../../../core/services/user.service';
import { Router } from '@angular/router';
import { TimeService } from '../../../time.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [Animations.animate]
})
export class CalendarComponent implements OnInit {

  user: User;

  view: string;
  viewDate: Date;
  activeDayIsOpen: boolean;
  selectedDay: any;

  public actions: CalendarEventAction[];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[];

  confirmDialogRef: MatDialogRef<AppConfirmDialogComponent>;
  dialogRef: any;

  constructor(public dialog: MatDialog, private calendarService: CalendarService, private userService: UserService, private router: Router, private timeService: TimeService) {
    userService.user$.subscribe((user: User) => this.user = user);

    this.view = 'month';
    this.viewDate = new Date();
    this.activeDayIsOpen = true;
    this.selectedDay = {date: startOfDay(new Date())};

    this.actions = [
        // {
        //     label  : '<i class="material-icons s-16">forward</i>',
        //     onClick: ({event}: { event: any }): void => {
        //         this.router.navigate(['/app/race/view', event.info._id]);
        //     }
        // },
        // {
        //     label  : '<i class="material-icons s-16">edit</i>',
        //     onClick: ({event}: { event: CalendarEvent }): void => {
        //         this.editEvent('edit', event);
        //     }
        // },
        // {
        //     label  : '<i class="material-icons s-16">delete</i>',
        //     onClick: ({event}: { event: CalendarEvent }): void => {
        //         this.deleteEvent(event);
        //     }
        // }
    ];

    /**
     * Get events from service/server
     */
    this.calendarService.getEvents();
  }

  ngOnInit() {
    /**
     * Watch re-render-refresh for updating db
     */
    this.refresh.subscribe(updateDB => {
      // console.warn('REFRESH');
      if (updateDB) {
        // console.warn('UPDATE DB');
        this.calendarService.updateEvents(this.events);
      }
    });

    this.calendarService.onEventsUpdated.subscribe(events => {
      this.setEvents();
      this.refresh.next();
    });
  }

  setEvents() {
    if (this.calendarService.events) {
      this.events = this.calendarService.events.map(item => {
        item.actions = this.actions;
        if (item.results && item.results.findIndex(result => result.runnerName === this.user.name ) !== -1) {
            item.classified = true;
        }
        return new CalendarEventModel(item);
      });
    }
  }

  /**
   * Before View Renderer
   * @param {any} header
   * @param {any} body
   */
  beforeMonthViewRender({header, body})
  {
      // console.info('beforeMonthViewRender');
      /**
       * Get the selected day
       */
      const _selectedDay = body.find((_day) => {
          return _day.date.getTime() === this.selectedDay.date.getTime();
      });

      if ( _selectedDay )
      {
          /**
           * Set selectedday style
           * @type {string}
           */
          _selectedDay.cssClass = 'mat-elevation-z3';
      }

  }

  /**
   * Day clicked
   * @param {MonthViewDay} day
   */
  dayClicked(day: CalendarMonthViewDay): void
  {
      const date: Date = day.date;
      const events: CalendarEvent[] = day.events;

      if ( isSameMonth(date, this.viewDate) )
      {
          if ( (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0 )
          {
              this.activeDayIsOpen = false;
          }
          else
          {
              this.activeDayIsOpen = true;
              this.viewDate = date;
          }
      }
      this.selectedDay = day;
      this.refresh.next();
  }

  /**
   * Event times changed
   * Event dropped or resized
   * @param {CalendarEvent} event
   * @param {Date} newStart
   * @param {Date} newEnd
   */
  eventTimesChanged({event, newStart, newEnd}: CalendarEventTimesChangedEvent): void
  {
      event.start = newStart;
      event.end = newEnd;
      // console.warn('Dropped or resized', event);
      this.refresh.next(true);
  }

  /**
   * Delete Event
   * @param event
   */
  deleteEvent(event)
  {
      this.confirmDialogRef = this.dialog.open(AppConfirmDialogComponent, {
          disableClose: false
      });

      this.confirmDialogRef.componentInstance.confirmMessage = '¿Estás seguro que deseas borrar la carrera?';

      this.confirmDialogRef.afterClosed().subscribe(result => {
          if ( result )
          {
              const eventIndex = this.events.indexOf(event);
              this.events.splice(eventIndex, 1);
              this.calendarService.deleteEvent(event);
              this.refresh.next(true);
          }
          this.confirmDialogRef = null;
      });

  }

  /**
   * Edit Event
   * @param {string} action
   * @param {CalendarEvent} event
   */
  editEvent(action: string, event: CalendarEvent)
  {
      const eventIndex = this.events.indexOf(event);

      this.dialogRef = this.dialog.open(AppCalendarEventFormDialogComponent, {
          panelClass: 'event-form-dialog',
          data      : {
              event : event,
              action: action
          }
      });

      this.dialogRef.afterClosed()
          .subscribe(response => {
              if ( !response )
              {
                  return;
              }
              const actionType: string = response[0];
              const formData: FormGroup = response[1];
              switch ( actionType )
              {
                  /**
                   * Save
                   */
                  case 'save':

                      this.events[eventIndex] = Object.assign(this.events[eventIndex], formData.value);
                      this.refresh.next(true);

                      break;
                  /**
                   * Delete
                   */
                  case 'delete':

                      this.deleteEvent(event);

                      break;
              }
          });
  }

    /**
     * Add Event
     */
    addEvent(): void
    {
        this.dialogRef = this.dialog.open(AppCalendarEventFormDialogComponent, {
            panelClass: 'event-form-dialog',
            data      : {
                action: 'new',
                date  : this.selectedDay.date
            }
        });
        this.dialogRef.afterClosed()
            .subscribe((response: any) => {
                if ( !response )
                {
                    return;
                }
                const newEvent = response.value;
                newEvent.name = newEvent.title;
                newEvent.dateStart = this.createDateSystem(newEvent.start, newEvent.startTime);
                newEvent.dateEnd = this.createDateSystem(newEvent.end, newEvent.endTime);
                newEvent.hourStart = newEvent.startTime;
                newEvent.hourEnd = newEvent.endTime;
                newEvent.actions = this.actions;
                newEvent.results = [{
                    runnerName: this.user.name,
                    time: this.timeService.timeFullHourStringToSeconds(newEvent.time),
                    rhythm: this.timeService.rhtyhmFullHourStringToSeconds(newEvent.rhythm)
                }];
                newEvent.custom = true;
                this.events.push(new CalendarEventModel(newEvent));
                this.calendarService.createEvent(newEvent);
                this.refresh.next(true);
            });
    }

    createDateSystem(date, hour) {
        const splitHour = hour.split(':');
    
        return this.timeService.createSystemMoment(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          splitHour[0],
          splitHour[1]
        );
      }
}

