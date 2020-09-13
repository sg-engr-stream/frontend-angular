import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RequestsService } from '../../services/requests/requests.service';
import { CommonService } from '../../services/common/common.service';

@Component({
  selector: 'app-password-reset-by-token',
  templateUrl: './password-reset-by-token.component.html',
  styleUrls: ['./password-reset-by-token.component.scss']
})
export class PasswordResetByTokenComponent implements OnInit {

  passwordResetForm = new FormGroup({
    username: new FormControl({value: '', disabled: true}, [Validators.minLength(3), Validators.maxLength(50)]),
    secret: new FormControl('', [Validators.minLength(6), Validators.maxLength(40)]),
    secretRetype: new FormControl('', [Validators.minLength(6), Validators.maxLength(40)])
  });

  hidePass = true;

  constructor(private routes: ActivatedRoute, private request: RequestsService, private common: CommonService) { }

  ngOnInit(): void {
    this.passwordResetForm.get('username').setValue(this.routes.snapshot.params.username);
  }

  resetPassword(): void {
    this.request.updatePasswordByToken({
      username: this.routes.snapshot.params.username,
      token: this.routes.snapshot.params.token,
      secret: this.passwordResetForm.get('secret').value
    }).subscribe(() => {
      this.request.login(this.routes.snapshot.params.username, this.passwordResetForm.get('secret').value);
    }, err => {
      let msg;
      if (err.error.statusCode === 501) {
        msg = 'Confirmation e-mail sending failed. Password might have updated. Please try to login with new password.';
      } else {
        msg = 'Failed to reset the password.';
      }
      this.common.openDialogMessage('Password Reset Failed', msg);
    });
  }

}
