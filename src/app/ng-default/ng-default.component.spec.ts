import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgDefaultComponent } from './ng-default.component';

describe('NgDefaultComponent', () => {
  let component: NgDefaultComponent;
  let fixture: ComponentFixture<NgDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgDefaultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
