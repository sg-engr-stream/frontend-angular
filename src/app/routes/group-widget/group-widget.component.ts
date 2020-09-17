import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../services/common/common.service';
import { RequestsService } from '../../services/requests/requests.service';
import { Group } from '../../models/group';
import { Card } from '../../models/card_model';
import { group } from '@angular/animations';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-group-widget',
  templateUrl: './group-widget.component.html',
  styleUrls: ['./group-widget.component.scss']
})
export class GroupWidgetComponent implements OnInit, OnDestroy, AfterViewInit {

  groupId: string;
  groupDetails = {} as Group;
  cardDetails = [{}] as Card[];
  embedCode: string;

  dataValid: boolean;
  origin = window.location.origin;

  constructor(private routes: ActivatedRoute, private common: CommonService, private request: RequestsService,
              private clip: ClipboardService) {
    this.common.onlyWidget = true;
    this.groupId = routes.snapshot.params.groupWidget;
    this.loadGroup(this.groupId);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.common.onlyWidget = true;
  }

  ngOnDestroy(): void {
    this.common.onlyWidget = false;
  }

  loadGroup(groupId): void {
    if (groupId !== undefined) {
      this.request.getCardDetailsByGroupIds([groupId]).subscribe(res => {
        this.groupDetails = res.result[groupId].group_details as Group;
        this.cardDetails = res.result[groupId].card_list as Card[];
        if (this.groupDetails.icon_url === null) {
          this.groupDetails.icon_url = '/favicon.ico';
        }
        this.embedCode = '<iframe src="' + window.location.href + '" style="border: none;" width="420" height="320"></iframe>';
        this.dataValid = this.groupDetails.status;
        this.onResize();
      }, () => {
        this.dataValid = false;
        this.common.openDialogMessage('Incorrect ShortUrl', window.location.href + ' does not exist or you don\'t have access.');
      });
    }
  }

  openShortUrl(shortUrl): void {
    window.open(this.origin + '/' + shortUrl);
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    const el = document.getElementById('group-widget-container');
    this.embedCode = '<iframe src="' + window.location.href + '" style="border: none;" width="' + el.offsetWidth + '" height="' + el.offsetHeight + '"></iframe>';
    // console.log(el.offsetHeight, el.offsetWidth);
  }

  copyContent(): void {
    this.clip.copy(this.embedCode);
    const el = document.getElementById('widget');
    const oldStyleColor = el.style.color;
    const oldStyleBg = el.style.backgroundColor;
    el.style.color = 'white';
    el.style.backgroundColor = 'gray';
    window.setTimeout(() => { el.style.color = oldStyleColor; el.style.backgroundColor = oldStyleBg; }, 500);
  }

  findDisabled($data): boolean {
    if ($data.expiry === null) {
      return !$data.status;
    } else {
      return !($data.status && new Date(new Date($data.expiry).toUTCString()) > new Date());
    }
  }
}
