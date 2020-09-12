import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RequestsService } from '../../services/requests/requests.service';
import { CommonService } from '../../services/common/common.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  reg = '([a-z]+://)(.)+';
  shortUrlForm = new FormGroup({
    title: new FormControl('', [Validators.minLength(3), Validators.maxLength(80)]),
    description: new FormControl('', [Validators.minLength(5), Validators.maxLength(200)]),
    icon_url: new FormControl('', [Validators.minLength(3), Validators.maxLength(200)]),
    expiry: new FormControl(''),
    redirectUrl: new FormControl('', [Validators.pattern(this.reg), Validators.maxLength(500)]),
    shortUrl: new FormControl('', [Validators.maxLength(50), Validators.pattern('([a-zA-Z0-9]*[\-_a-zA-Z0-9]+)')])
  });

  shortUrlAvailable: any;
  responseText: any;
  beforeShortUrl: string;
  verification = new FormGroup({
    verificationCode: new FormControl('', [Validators.pattern('([0-9]){6}'), Validators.maxLength(6)])
  });
  countDown = 0;

  constructor(private request: RequestsService, public common: CommonService) {
    this.beforeShortUrl = window.location.origin;
    // this.common.openDialogCardCreate({
    //   card_id: "t8nqk1e6sM447p8djtCJ",
    //   created_by: "public",
    //   date_created: "2020-09-12T05:48:28.908254",
    //   description: "Testing UI",
    //   expiry: null,
    //   icon_url: null,
    //   last_updated: "2020-09-12T05:48:28.908254",
    //   owner: "public",
    //   redirect_url: "https://indianexpress.com/article/technology/social/youtube-rolls-out-new-icon-design-changes-for-mobile-desktop-app-4820421/",
    //   short_url: "6cIHNnn4lf",
    //   status: true,
    //   title: "test"
    // });
  }

  ngOnInit(): void {
  }

  createShortUrl(): any {
    const data = {
      title: this.shortUrlForm.get('title').value,
      description: this.shortUrlForm.get('description').value,
      redirect_url: this.shortUrlForm.get('redirectUrl').value,
      expiry: this.shortUrlForm.get('expiry').value,
      icon_url: this.shortUrlForm.get('icon_url').value,
      short_url: this.shortUrlForm.get('shortUrl').value,
      host: window.location.origin
    };
    if (data.icon_url === undefined) {
      delete data.icon_url;
    } else if (data.icon_url.length === 0) {
      delete data.icon_url;
    }
    if (data.short_url === undefined) {
      delete data.short_url;
    } else if (data.short_url.length === 0) {
      delete data.short_url;
    }
    if (data.expiry === undefined) {
      delete data.expiry;
    } else if (data.expiry.length === 0) {
      delete data.expiry;
    }
    this.request.createShortUrl(data).subscribe(res => {
      this.common.openDialogCardCreate(res);
    }, err => {
      this.common.openDialogMessage('Error ' + err.statusCode, err.error.response);
    });
  }

  checkShortUrlAvailability(): any {
    this.request.checkShortUrlAvailability(this.shortUrlForm.get('shortUrl').value).subscribe(
      res => {
        this.shortUrlAvailable = true;
        this.responseText = res.response.replace('ShortUrl', this.shortUrlForm.get('shortUrl').value);
      }, err => {
        this.shortUrlAvailable = false;
        this.responseText = err.error.response.replace('ShortUrl', this.shortUrlForm.get('shortUrl').value);
      }
    );
  }

  keyupShortUrl(): void {
    this.shortUrlAvailable = false;
    this.responseText = null;
  }

  resendVerification(): void {
    this.countDown = 30;
    const t = window.setInterval(() => {
      this.countDown -= 1;
      if (this.countDown === 0) {
        window.clearInterval(t);
      }
    }, 1000);
    this.request.resendVerification().subscribe(() => {
    }, () => {
      this.common.openDialogMessage('Resend Verification Code Failed',
        'Error occurred while sending the verification to your e-mail. Please try again.');
      window.clearInterval(t);
      this.countDown = 0;
    });
  }

  verify(): void {
    this.request.verify(this.verification.get('verificationCode').value).subscribe(res => {
      this.common.emailVerified = true;
    }, () => {
      this.common.openDialogMessage('Verification Failed', 'Invalid code. Please try again.');
    });
  }
}
