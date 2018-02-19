import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-classifieds',
  templateUrl: './classifieds.component.html',
  styleUrls: ['./classifieds.component.scss']
})
export class ClassifiedsComponent implements OnInit {

  @Input() race: any;

  constructor() { }

  ngOnInit() {
  }

}
