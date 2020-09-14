import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-btn-cell-renderer',
  templateUrl: './btn-cell-renderer.component.html',
  styleUrls: ['./btn-cell-renderer.component.scss']
})
export class BtnCellRendererComponent implements ICellRendererAngularComp, OnInit {

  private params: any;

  constructor() {
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
    window.open(window.location.origin + '/' + this.params.data.short_url);
  }

  ngOnInit(): void {
  }

}
