import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../services/common/common.service';
import { Card } from '../../models/card_model';
import { RequestsService } from '../../services/requests/requests.service';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent implements OnInit, OnDestroy, AfterViewInit {

  cardId: string;
  cardDetails = {} as Card;
  embedCode: string;

  dataValid: boolean;

  constructor(private routes: ActivatedRoute, private common: CommonService, private request: RequestsService,
              private clip: ClipboardService) {
    this.common.onlyWidget = true;
    this.cardId = routes.snapshot.params.widget;
    this.loadCard(this.cardId);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.common.onlyWidget = true;
  }

  ngOnDestroy(): void {
    this.common.onlyWidget = false;
  }

  loadCard(cardId): void {
    if (cardId !== undefined) {
      this.request.getCardDetails(cardId).subscribe(res => {
        this.cardDetails = res.result[0] as Card;
        if (this.cardDetails.expiry === null) {
          this.cardDetails.expiry = 'No Expiry';
        }
        if (this.cardDetails.icon_url === null) {
          this.cardDetails.icon_url = '/favicon.ico';
        }
        this.embedCode = '<iframe src="' + window.location.href + '" style="border: none;" width="420" height="320"></iframe>';
        this.dataValid = true;
      }, () => {
        this.dataValid = false;
        this.common.openDialogMessage('Incorrect ShortUrl', window.location.href + ' does not exist or you don\'t have access.');
      });
    }
  }

  redirect(): void {
    window.open(this.cardDetails.short_url);
  }

  copyContent(): void {
    this.clip.copy(this.embedCode);
    const el = document.getElementById('widget');
    const oldStyleColor = el.style.color;
    const oldStyleBg = el.style.backgroundColor;
    el.style.color = 'white';
    el.style.backgroundColor = 'gray';
    window.setTimeout(() => {
      el.style.color = oldStyleColor;
      el.style.backgroundColor = oldStyleBg;
    }, 500);
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    const el = document.getElementById('widget-container-card');
    this.embedCode = '<iframe src="' + window.location.href + '" style="border: none;" width="' + el.offsetWidth + '" height="' + el.offsetHeight + '"></iframe>';
    // console.log(el.offsetHeight, el.offsetWidth);
  }
}
