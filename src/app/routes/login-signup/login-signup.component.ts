import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { RequestsService } from '../../services/requests/requests.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../services/common/common.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.scss']
})
export class LoginSignupComponent implements OnInit {

  loginType: any;
  hidePass = true;
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.minLength(3), Validators.maxLength(50)]),
    secret: new FormControl('', [Validators.minLength(6), Validators.maxLength(40)])
  });
  signupForm = new FormGroup({
    name: new FormControl('', [Validators.minLength(3), Validators.maxLength(80)]),
    username: new FormControl('', [Validators.minLength(3), Validators.maxLength(50)]),
    email: new FormControl('', [Validators.email, Validators.maxLength(120)]),
    secret: new FormControl('', [Validators.minLength(6), Validators.maxLength(40)]),
  });
  usernameResponseMessage: any;
  usernameAvailable: any;

  constructor(private routes: ActivatedRoute, private cookie: CookieService, private requests: RequestsService,
              private common: CommonService, private router: Router) { }

  ngOnInit(): void {
    this.routes.data.subscribe(data => {this.loginType = data.type; });
    console.log(this.loginType);
  }

  login(): any {
    this.requests.login(this.loginForm.get('username').value, this.loginForm.get('secret').value).subscribe(res => {
      this.common.setUserDetails(res.result);
    }, err => {
      this.common.openDialogMessage('Login Failed', 'User or Password is wrong');
    });
  }

  signup(): any {
    this.requests.signup(
      this.signupForm.get('name').value,
      this.signupForm.get('username').value,
      this.signupForm.get('email').value,
      this.signupForm.get('secret').value
    ).subscribe(res => {
      this.common.setUserDetails(res.result);
    }, err => {
      this.common.openDialogMessage('SignUp Failed', err.error.message);
    });
  }

  checkUsernameAvailability(): any {
    this.usernameResponseMessage = null;
    this.requests.checkUsernameAvailability(this.signupForm.get('username').value).subscribe(res => {
      this.usernameResponseMessage = res.response.replace('Username', this.signupForm.get('username').value);
      this.usernameAvailable = true;
    }, error => {
      this.usernameResponseMessage = error.error.response;
      this.usernameAvailable = false;
    });
  }

  clearAvailabilityMessage(): void {
    this.usernameResponseMessage = null;
    this.usernameAvailable = null;
  }

}
