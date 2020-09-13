import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { RequestsService } from '../../services/requests/requests.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../services/common/common.service';

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
    email: new FormControl('', [Validators.email, Validators.pattern('(.)+[@](.)+[.](.)+'), Validators.maxLength(120)]),
    secret: new FormControl('', [Validators.minLength(6), Validators.maxLength(40)]),
  });
  usernameResponseMessage: string;
  usernameAvailable: boolean;

  emailResponseMessage: string;
  emailAvailable: boolean;

  forgotPass: boolean;

  resetCountdown = 0;

  constructor(private routes: ActivatedRoute, private cookie: CookieService, private request: RequestsService,
              private common: CommonService) {
    this.forgotPass = false;
  }

  ngOnInit(): void {
    this.routes.data.subscribe(data => {
      this.loginType = data.type;
    });
  }

  login(): any {
    this.request.login(this.loginForm.get('username').value, this.loginForm.get('secret').value);
  }

  signup(): any {
    this.request.signup(
      this.signupForm.get('name').value,
      this.signupForm.get('username').value,
      this.signupForm.get('email').value,
      this.signupForm.get('secret').value
    );
  }

  checkUsernameAvailability(): any {
    this.usernameResponseMessage = null;
    if (this.signupForm.get('username').valid) {
      this.request.checkUsernameAvailability(this.signupForm.get('username').value).subscribe(res => {
        this.usernameResponseMessage = res.response.replace('Username', this.signupForm.get('username').value);
        this.usernameAvailable = true;
      }, error => {
        this.usernameResponseMessage = error.error.response;
        this.usernameAvailable = false;
      });
    }
  }

  checkEmailAvailability(): any {
    this.emailResponseMessage = null;
    if (this.signupForm.get('email').valid) {
      this.request.checkEmailAvailability(this.signupForm.get('email').value).subscribe(res => {
        this.emailResponseMessage = res.response.replace('Username', this.signupForm.get('email').value);
        this.emailAvailable = true;
      }, () => {
        this.emailResponseMessage = 'Email is already registered';
        this.emailAvailable = false;
      });
    }
  }

  sendPasswordReset(): any {
    this.resetCountdown = 30;
    const t = window.setInterval(() => {
      this.resetCountdown -= 1;
      if (this.resetCountdown === 0) {
        window.clearInterval(t);
      }
    }, 1000);
    this.request.sendPasswordReset(this.signupForm.get('email').value).subscribe(() => {}, err => {
      let msg;
      if (err.error.statusCode === 404) {
        msg = 'User Not Found';
      } else {
        msg = 'Error occurred while sending the password reset link to your e-mail. Please try again.';
      }
      this.common.openDialogMessage('Reset Password Failed', msg);
      window.clearInterval(t);
      this.resetCountdown = 0;
    });
  }

  clearAvailabilityMessage(): void {
    this.usernameResponseMessage = null;
    this.usernameAvailable = null;
  }

  clearEmailAvailabilityMessage(): void {
    this.emailResponseMessage = null;
    this.emailAvailable = null;
  }

}
