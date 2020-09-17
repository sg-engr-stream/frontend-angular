import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupWidgetComponent } from './group-widget.component';

describe('GroupWidgetComponent', () => {
  let component: GroupWidgetComponent;
  let fixture: ComponentFixture<GroupWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
