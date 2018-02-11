import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrequentQuestionsComponent } from './frequent-questions.component';

describe('FrequentQuestionsComponent', () => {
  let component: FrequentQuestionsComponent;
  let fixture: ComponentFixture<FrequentQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrequentQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrequentQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
