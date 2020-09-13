import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardCreateComponent } from './card-create.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('CardCreateComponent', () => {
  let component: CardCreateComponent;
  let fixture: ComponentFixture<CardCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardCreateComponent ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { message: { card_id: null, expiry: '' } } }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
