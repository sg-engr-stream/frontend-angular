import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../services/common/common.service';
import { RequestsService } from '../../services/requests/requests.service';
import { Card } from '../../models/card_model';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements AfterViewInit {

  cardDetails = {} as Card;
  origin = window.location.origin;
  editable = {
    title: false,
    createBy: false,
    owner: false,
    description: false,
    redirectUrl: false,
    shortUrl: false,
    iconUrl: false,
    expiry: false,
    status: false
  };

  dataValid = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private routes: ActivatedRoute,
              private common: CommonService, private request: RequestsService) {
  }

  ngAfterViewInit(): void {
    if (this.data !== null) {
      window.setTimeout(() =>
      this.setCardDetails(this.data.cardDetails as Card), 200);
    } else {
      const cardId = [this.routes.snapshot.params.cardId];
      this.request.getCardDetails({ card_id: cardId }).subscribe(res => {
        this.setCardDetails(res.result[0]);
      }, () => {
        this.dataValid = false;
        this.common.openDialogMessage('Details not found', 'Either card not exist or you don\'t have the permission');
      });
    }
  }

  setCardDetails(cardDetails): void {
    this.cardDetails = cardDetails as Card;
    this.dataValid = true;
    if (this.cardDetails.expiry !== null) {
      this.cardDetails.expiry = new Date(this.cardDetails.expiry).toISOString().slice(0, 16);
    }
  }

}
