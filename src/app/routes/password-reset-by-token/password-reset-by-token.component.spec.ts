import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordResetByTokenComponent } from './password-reset-by-token.component';

describe('PasswordResetByTokenComponent', () => {
  let component: PasswordResetByTokenComponent;
  let fixture: ComponentFixture<PasswordResetByTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordResetByTokenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordResetByTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
