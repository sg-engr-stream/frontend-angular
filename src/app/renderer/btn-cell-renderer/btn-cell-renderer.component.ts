import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { CommonService } from '../../services/common/common.service';

@Component({
  selector: 'app-btn-cell-renderer',
  templateUrl: './btn-cell-renderer.component.html',
  styleUrls: ['./btn-cell-renderer.component.scss']
})
export class BtnCellRendererComponent implements ICellRendererAngularComp, OnInit {

  params: any;

  constructor(private common: CommonService) {
  }

  agInit(params: any): void {
    this.params = params;
  }

  btnClickedHandler($event: MouseEvent): any {
    this.params.clicked(this.params);
  }

  refresh(params: any): boolean {
    console.log(params);
    return true;
  }

  openWidget($event: MouseEvent): void {
    window.open(window.location.origin + '/w/' + this.params.data.card_id);
  }

  redirectShortUrl($event: MouseEvent): void {
    if (this.getRedirectStatus()) {
      window.open(window.location.origin + '/' + this.params.data.short_url);
    } else {
      this.common.openDialogMessage('Cannot Redirect', 'Card is deactivated or expired');
    }
  }

  ngOnInit(): void {
  }

  getRedirectStatus(): boolean {
    const check = new Date(this.params.data.expiry) <= new Date(new Date().toUTCString());
    return (this.params.data.expiry === null || !check) && this.params.data.status;
  }

}
