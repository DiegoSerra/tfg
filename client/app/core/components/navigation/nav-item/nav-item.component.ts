import {Component, HostBinding, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.scss']
})
export class AppNavItemComponent implements OnInit {
  @HostBinding('class') classes = 'nav-item';
  @Input() item: any;

  constructor() {
  }

  ngOnInit() {
  }
}
