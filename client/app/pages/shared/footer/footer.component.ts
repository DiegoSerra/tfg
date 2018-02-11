import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {LandingScrollService} from '../../../landing-page/services/landing-scroll.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  providers: [LandingScrollService]
})
export class FooterComponent implements OnInit {

  @Output('onGoToFragment') onGoToFragment = new EventEmitter<string>();

  constructor(private landingScroll: LandingScrollService) { }

  ngOnInit() {
  }

  goToFragment(fragment, speed = 1500) {
    this.onGoToFragment.emit(fragment);
  }
}
