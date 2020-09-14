import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common/common.service';
import { RequestsService } from '../../services/requests/requests.service';
import { DialogService } from '../../services/dialog/dialog.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  originalResults = {owner: [], shared_with_me: [], groups_owned: [], groups_shared_with_me: []};
  sortedResults = this.originalResults;
  selectedGroupOwned: string;
  selectedGroupAccess: string;
  constructor(private common: CommonService, private request: RequestsService, private dialogService: DialogService) { }

  ngOnInit(): void {
    if (this.common.username !== null) {
      this.request.getProfileData().subscribe(res => {
        this.originalResults = res.result;
        this.sortedResults = res.result;
        console.log(this.originalResults);
      }, () => {
        this.common.openDialogMessage('Error loading profile', 'Error occurred while trying to load your profile. Contact us, if you think there is some problem in product.');
      });
    }
  }

  getExpiryFormatted(expiry): string {
    if (expiry === null) {
      return 'No Expiry';
    }
    return new Date(expiry).toLocaleString();
  }

  openCardInDialog(cardDetails): void {
    if (cardDetails.access_type === undefined) {
      cardDetails.access_type = 'RW';
    }
    this.dialogService.openDialogCardDetails(cardDetails);
  }

  expired(expiry): boolean {
    if (expiry === null) {
      return false;
    }
    return new Date(expiry) <= new Date(new Date().toUTCString());
  }

  openWidget(cardId): void {
    window.open('/w/' + cardId);
  }
}
