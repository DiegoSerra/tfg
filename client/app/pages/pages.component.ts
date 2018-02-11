import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

  isSideNavOpen = false;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  goToLandingPageFragment(fragment) {
    this.router.navigate(['/'], {queryParams: {fragment}});
  }

}
