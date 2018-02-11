import * as moment from 'moment-timezone/moment-timezone';
moment.tz.add([
  'Europe/Madrid|WET WEST WEMT CET CEST|0 -10 -20 -10 -20|010101010101010101210343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343|-25Td0 19B0 1cL0 1dd0 b1z0 18p0 3HX0 17d0 1fz0 1a10 1io0 1a00 1in0 17d0 iIn0 Hd0 1cL0 bb0 1200 2s20 14n0 5aL0 Mp0 1vz0 17d0 1in0 17d0 1in0 17d0 1in0 17d0 6hX0 11B0 XHX0 1a10 1fz0 1a10 19X0 1cN0 1fz0 1a10 1fC0 1cM0 1cM0 1cM0 1fA0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|62e5',
]);

export class TimeService {

  private static systemTZ = 'Europe/Madrid';

  public static createUTCMoment(fullYear: number, month: number, day: number, hour: number = 0, minutes: number = 0) {
    return moment().utc(fullYear, month, day, hour, minutes);
  }

  public static createSystemMoment(fullYear: number, month: number, date: number, hours: number = 0, minutes: number = 0) {
    return moment.tz(this.systemTZ)
      .year(fullYear)
      .month(month)
      .date(date)
      .hours(hours)
      .minutes(minutes);
  }

  public static toUTCMoment(momentDate: moment): moment {
    return momentDate.utc();
  }

  public static dateToUTCMoment(date: Date): moment {
    return this.toUTCMoment(moment(date)).utc();
  }

  public static toSystemMoment(momentDate: moment): moment {
    return momentDate.tz(this.systemTZ);
  }

  public static dateToSystemMoment(date: Date): moment {
    return this.toSystemMoment(moment(date));
  }

  public static fromSystemToUTCHour(hourString: string, minuteString?: string): string {
    if (!minuteString) {
      const splitTime: string[] = hourString.split(':');
      hourString = splitTime[0];
      minuteString = splitTime[1];
    }

    const systemMoment = moment.tz(this.systemTZ).hours(hourString).minutes(minuteString).utc();
    return this.momentToFullHourString(systemMoment);
  }

  public static fromUTCtoSystemHour(hourString: string, minuteString?: string): string {
    if (!minuteString) {
      const splitTime: string[] = hourString.split(':');
      hourString = splitTime[0];
      minuteString = splitTime[1];
    }

    const utcMoment = moment.utc().hours(hourString).minutes(minuteString).tz(this.systemTZ);
    return this.momentToFullHourString(utcMoment);
  }

  public static fullHourString(hourString: number, minuteString: number) {
    return `${this.toHourString(hourString)}:${this.toMinutesString(minuteString)}`;
  }

  public static momentToFullHourString(dateMoment: moment): string {
    return this.fullHourString(dateMoment.hours(), dateMoment.minutes());
  }

  public static toHourString(hour: number) {
    return hour >= 10 ? `${hour}` : `0${hour}`;
  }

  public static toMinutesString(minutes: number) {
    return minutes >= 10 ? `${minutes}` : `0${minutes}`;
  }

}
