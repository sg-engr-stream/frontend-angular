import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../services/common/common.service';
import { RequestsService } from '../../services/requests/requests.service';
import { Card } from '../../models/card_model';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

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

  dataValid: boolean;

  constructor(private routes: ActivatedRoute, private common: CommonService, private request: RequestsService) { }

  ngOnInit(): void {
    this.request.getCardDetails({card_id: [this.routes.snapshot.params.cardId]}).subscribe(res => {
      console.log(res.result[0]);
      this.cardDetails = res.result[0] as Card;
      if (this.cardDetails.expiry === null) {
        this.cardDetails.expiry = new Date(this.cardDetails.date_created).toISOString().slice(0, 16);
      }
      this.dataValid = true;
    }, () => {
      this.dataValid = false;
      this.common.openDialogMessage('Details not found', 'Either card not exist or you don\'t have the permission');
    });
  }

}
