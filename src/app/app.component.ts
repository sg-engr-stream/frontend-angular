import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { RequestsService } from './services/requests/requests.service';
import { CommonService } from './services/common/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'frontend-app';
  constructor(private cookie: CookieService, private request: RequestsService, public common: CommonService,
              private router: Router) {
    this.loadUser();
  }

  loadUser(): void {
    if (this.cookie.check('token')) {
      this.request.fetchUserDetails().subscribe(
      res => {
        this.common.setUserDetails(res.result, false);
      }, err => {
        this.router.navigate(['/']);
      });
    }
  }
}
