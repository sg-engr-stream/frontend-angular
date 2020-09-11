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
    redirectUrl: new FormControl('', [Validators.pattern(this.reg)]),
    shortUrl: new FormControl('')
  });

  shortUrlAvailable: any;
  responseText: any;

  constructor(private request: RequestsService, private common: CommonService) {
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
      short_url: this.shortUrlForm.get('shortUrl').value
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
      this.common.openDialogCardCreate(res.title, res);
    }, err => {
      this.common.openDialogMessage('Error ' + err.statusCode, err.error.response);
    });
  }

  checkShortUrlAvailability(): any {
    this.request.checkShortUrlAvailability(this.shortUrlForm.get('shortUrl').value).subscribe(
      res => {
        this.shortUrlAvailable = true;
        this.responseText = res.response;
      }, err => {
        this.shortUrlAvailable = true;
        this.responseText = err.error.response;
      }
    );
  }

}
