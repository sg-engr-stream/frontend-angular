import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-card-create',
  templateUrl: './card-create.component.html',
  styleUrls: ['./card-create.component.scss']
})
export class CardCreateComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.data.message.widget = window.location.origin + '/w/' + this.data.message.card_id;
    this.data.message.edit = window.location.origin + '/edit/' + this.data.message.card_id;
    this.data.message.short_url = window.location.origin + '/' + this.data.message.short_url;
    if (this.data.message.expiry === null) {
      this.data.message.expiry = 'No Expiry';
    } else if (this.data.message.expiry.length === 0) {
      this.data.message.expiry = 'No Expiry';
    }
  }

  openInNewTab(source): void {
    switch (source) {
      case 'shortUrl': window.open(this.data.message.short_url); break;
      case 'widget': window.open(this.data.message.widget); break;
      case 'edit': window.open(this.data.message.edit); break;
      default: break;
    }
  }
}
