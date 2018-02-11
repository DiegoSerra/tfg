import { Injectable } from '@angular/core';

@Injectable()
export class LandingScrollService {

  constructor() { }

  goToFragment(fragment, speed = 1500) {
    try {
      const element = document.getElementById(fragment);
      window.scrollTo(element.offsetTop);
    } catch (err) {
      console.log(err);
    }
  }
}
