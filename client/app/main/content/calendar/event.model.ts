import {
  CalendarEventAction
} from 'angular-calendar';

import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
// import { CalendarEvent } from 'calendar-utils/dist/calendar-utils';

/*
export interface EventAction
{
  label: string;
  cssClass?: string;

  onClick({event}: {
      event: CalendarEvent;
  }): any;
}*/

export class CalendarEventModel
{
  start: Date;
  end?: Date;
  title: string;
  color: {
      primary: string;
      secondary: string;
  };
  actions?: CalendarEventAction[];
  allDay?: boolean;
  cssClass?: string;
  resizable?: {
      beforeStart?: boolean;
      afterEnd?: boolean;
  };
  draggable?: boolean;
  meta?: {
      location: string,
      notes: string
  };
  info: any;

  constructor(data?) {
    data = data || {};
    this.start = new Date(data.dateStart) || startOfDay(new Date());
    this.end = new Date(data.dateEnd) || endOfDay(new Date());
    this.title = data.name || '';
    this.color = {
      primary  : data.color && data.color.primary || this.start > new Date() ? '#0288d1' : '#b5dcf2',
      secondary: data.color && data.color.secondary || this.start > new Date() ? '#b3e5fc' : '#d9f1fe'
    };
    this.draggable = data.draggable || false;
    this.resizable = {
      beforeStart: data.resizable && data.resizable.beforeStart || false,
      afterEnd   : data.resizable && data.resizable.afterEnd || false
    };
    this.actions = data.actions || [];
    this.allDay = data.allDay || false;
    this.cssClass = data.cssClass || '';
    this.meta = {
      location: data.meta && data.meta.location || '',
      notes   : data.meta && data.meta.notes || ''
    };
    this.info = {...data};
  }

}
