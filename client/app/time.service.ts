import {Injectable} from '@angular/core';

import * as moment from 'moment-timezone/moment-timezone';

@Injectable()
export class TimeService {

  private systemTZ = 'Europe/Madrid';

  constructor() { }

  createUTCMoment(fullYear: number, month: number, day: number, hour: number = 0, minutes: number = 0) {
    return moment().utc(fullYear, month, day, hour, minutes);
  }

  createSystemMoment(fullYear: number, month: number, date: number, hours: number = 0, minutes: number = 0) {
    return moment.tz(this.systemTZ)
      .year(fullYear)
      .month(month)
      .date(date)
      .hours(hours)
      .minutes(minutes);
  }

  toUTCMoment(momentDate: moment): moment {
    return momentDate.utc();
  }

  dateToUTCMoment(date: Date): moment {
    return this.toUTCMoment(moment(date)).utc();
  }

  toSystemMoment(momentDate: moment): moment {
    return momentDate.tz(this.systemTZ);
  }

  dateToSystemMoment(date: Date): moment {
    return this.toSystemMoment(moment(date));
  }

  fromSystemToUTCHour(hourString: string, minuteString?: string): string {
    if (!minuteString) {
      const splitTime: string[] = hourString.split(':');
      hourString = splitTime[0];
      minuteString = splitTime[1];
    }

    const systemMoment = moment.tz(this.systemTZ).hours(hourString).minutes(minuteString).utc();
    return this.momentToFullHourString(systemMoment);
  }

  fromUTCtoSystemHour(hourString: string, minuteString?: string): string {
    if (!minuteString) {
      const splitTime: string[] = hourString.split(':');
      hourString = splitTime[0];
      minuteString = splitTime[1];
    }

    const utcMoment = moment.utc().hours(hourString).minutes(minuteString).tz(this.systemTZ);
    return this.momentToFullHourString(utcMoment);
  }

  momentToFullHourString(dateMoment: moment): string {
    return `${this.momentToHourString(dateMoment)}:${this.momentToMinutesString(dateMoment)}`;
  }

  momentToHourString(dateMoment: moment): string {
    return dateMoment.hours() >= 10 ? `${dateMoment.hours()}` : `0${dateMoment.hours()}`;
  }

  momentToMinutesString(dateMoment: moment): string {
    return dateMoment.minutes() >= 10 ? `${dateMoment.minutes()}` : `0${dateMoment.minutes()}`;
  }

  toHourString(hour: number) {
    return hour >= 10 ? `${hour}` : `0${hour}`;
  }

  toMinutesString(minutes: number) {
    return minutes >= 10 ? `${minutes}` : `0${minutes}`;
  }

  toSecondsString(seconds: number) {
    return seconds >= 10 ? `${seconds}` : `0${seconds}`;
  }

  fullHourString(hourString: number, minuteString: number) {
    return `${this.toHourString(hourString)}:${this.toMinutesString(minuteString)}`;
  }

  rhythmString(minuteString: number, secondString: number) {
    return `${this.toMinutesString(minuteString)}:${this.toSecondsString(secondString)}`;
  }

  stringDateToRhythmString(date: string) {
    return this.rhythmString(new Date(date).getHours(), new Date(date).getMinutes());
  }

  stringRhythmToFullSeconds(date: string) {
    const minutes = new Date(date).getHours() - 1;
    const minutesToSeconds = minutes * 60;
    const seconds = new Date(date).getMinutes();
    return (minutesToSeconds + seconds);
  }

  stringDateToFullSeconds(date: string, rest1Hour = false) {
    const hours = !rest1Hour ? new Date(date).getHours() : new Date(date).getHours() - 1;
    const hoursToSeconds = hours * 60 * 60;
    const minutes = new Date(date).getMinutes();
    const minutesToSeconds = minutes * 60;
    const seconds = new Date(date).getSeconds();
    return (hoursToSeconds + minutesToSeconds + seconds);
  }

  dateToFullHourString(date: Date) {
    return this.fullHourString(date.getHours(), date.getMinutes());
  }
}
