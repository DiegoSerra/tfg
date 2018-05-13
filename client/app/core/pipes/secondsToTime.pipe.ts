import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secondsToTime'
})

export class SecondsToTimePipe implements PipeTransform{
  transform(_seconds){
    const _minutes = Math.floor(_seconds / 60);
    if (_minutes > 0) {
      const hours = Math.floor(_minutes / 60);
      if (hours > 0) {
        const minutes = (_minutes - hours * 60);
        const seconds = Math.floor(_seconds - _minutes * 60);
        return (hours >= 10 ? `${hours}` : `0${hours}`) + ':' + (minutes >= 10 ? `${minutes}` : `0${minutes}`) + ':' + (seconds >= 10 ? `${seconds}` : `0${seconds}`);
      } else {
        const seconds = Math.floor(_seconds - _minutes * 60);
        return (_minutes >= 10 ? `${_minutes}` : `0${_minutes}`) + ':' + (seconds >= 10 ? `${seconds}` : `0${seconds}`);
      }
    } 
  }
}
