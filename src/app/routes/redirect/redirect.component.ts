import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestsService } from '../../services/requests/requests.service';
import { CommonService } from '../../services/common/common.service';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss']
})
export class RedirectComponent implements OnInit {

  redirectUrl: string;
  redirectGetStatus: boolean =  null;
  constructor(private routes: ActivatedRoute, private request: RequestsService, private common: CommonService) {
  }

  ngOnInit(): void {
    this.routes.params.subscribe(params => {
      this.request.getRedirectUrl(params.shortUrl).subscribe(res => {
        this.redirectUrl = res.redirect_url;
        this.redirectGetStatus = true;
        window.open(res.redirect_url, '_self');
      }, () => {
        this.redirectGetStatus = false;
        this.common.openDialogMessage('Redirect Failed', window.location.href + ' does not exist or you do not have the permission to access it.')
      });
    });
  }

}
