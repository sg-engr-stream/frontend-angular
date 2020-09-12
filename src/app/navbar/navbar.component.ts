import { Component, OnInit, Output, EventEmitter, HostListener, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RequestsService } from '../services/requests/requests.service';
import { CommonService } from '../services/common/common.service';
import { CookieService } from 'ngx-cookie-service';
import { LoginSignupComponent } from '../routes/login-signup/login-signup.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, AfterViewInit {
  @Output() public sidenavToggle = new EventEmitter();

  constructor(public common: CommonService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }
}
