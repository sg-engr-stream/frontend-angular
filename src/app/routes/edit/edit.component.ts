import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../services/common/common.service';
import { RequestsService } from '../../services/requests/requests.service';
import { Card } from '../../models/card_model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoaderService } from '../../services/loader/loader.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements AfterViewInit {

  @ViewChild('toggleElement') ref: ElementRef;

  cardDetails = {} as Card;
  origin = window.location.origin;
  editable = {
    title: false,
    owner: false,
    description: false,
    redirectUrl: false,
    shortUrl: false,
    iconUrl: false,
    expiry: false,
    status: false,
    accessList: false
  };

  oldValues = {
    title: null,
    owner: null,
    description: null,
    redirect_url: null,
    short_url: null,
    icon_url: null,
    expiry: null,
    status: false,
    user_access_list: null
  };

  dataValid: boolean;

  usernameForAccess = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private routes: ActivatedRoute, private router: Router,
              private common: CommonService, private request: RequestsService, private loaderService: LoaderService) {
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
    if (this.cardDetails.owner === 'public') {
      this.cardDetails.access_type = 'RW';
    }
    this.initOldValues();
    if (this.cardDetails.expiry !== null) {
      this.cardDetails.expiry = new Date(this.cardDetails.expiry).toISOString().slice(0, 16);
    }
  }

  initOldValues(): void {
    this.oldValues.title = this.cardDetails.title;
    this.oldValues.owner = this.cardDetails.owner;
    this.oldValues.description = this.cardDetails.description;
    this.oldValues.redirect_url = this.cardDetails.redirect_url;
    this.oldValues.short_url = this.cardDetails.short_url;
    this.oldValues.icon_url = this.cardDetails.icon_url;
    this.oldValues.expiry = this.cardDetails.expiry;
    this.oldValues.status = this.cardDetails.status;
    this.oldValues.user_access_list = this.cardDetails.user_access_list;
  }

  updateFieldByKey(key, state = true): void {
    let updateDict = {};
    switch (key) {
      case 'title' :
        updateDict = { title: this.cardDetails.title };
        break;
      case 'owner':
        updateDict = { owner: this.cardDetails.owner };
        break;
      case 'description':
        updateDict = { description: this.cardDetails.description };
        break;
      case 'redirectUrl':
        updateDict = { redirect_url: this.cardDetails.redirect_url };
        break;
      case 'shortUrl':
        updateDict = { short_url: this.cardDetails.short_url };
        break;
      case 'iconUrl':
        updateDict = { icon_url: this.cardDetails.icon_url };
        break;
      case 'expiry':
        updateDict = { expiry: this.cardDetails.expiry };
        break;
      case 'status':
        updateDict = { status: this.cardDetails.status };
        break;
      case 'accessList':
        updateDict = { user_access_list: this.cardDetails.user_access_list };
        break;
      default:
        return;
    }
    this.editable[key] = !this.editable[key];
    console.log(updateDict);
    if (!state) {
      this.cardDetails[Object.keys(updateDict)[0]] = this.oldValues[Object.keys(updateDict)[0]];
      return;
    }
    this.request.updateCardDetails(this.cardDetails.card_id, updateDict).subscribe(res => {
      console.log(res);
      this.oldValues[Object.keys(updateDict)[0]] = this.cardDetails[Object.keys(updateDict)[0]];
    }, err => {
      this.cardDetails[Object.keys(updateDict)[0]] = this.oldValues[Object.keys(updateDict)[0]];
      if (err.error.statusCode === 404) {
        this.common.openDialogMessage('Not found', 'Record does not exist.');
      } else {
        this.common.openDialogMessage('Error', err.error.response);
      }
    });
    this.loaderService.hide();
  }

  checkShortUrlAvailabilityAndUpdate(): any {
    this.request.checkShortUrlAvailability(this.cardDetails.short_url).subscribe(
      () => {
        this.updateFieldByKey('shortUrl');
      }, err => {
        if (err.error.statusCode === 404) {
          this.common.openDialogMessage('Not available', err.error.response.replace('ShortUrl', this.cardDetails.short_url));
        } else {
          this.common.openDialogMessage('Error', err.error.response);
        }
      }
    );
    this.loaderService.hide();
  }

  addUserForCardAccess(): void {
    const data = { username: [this.usernameForAccess], card_id: this.cardDetails.card_id };
    // const data = { username: this.usernameForAccess, card_id: this.cardDetails.card_id, access_type: 'RO' };
    // this.cardDetails.user_access_list.push(data);
    this.request.addCardAccess(data).subscribe(res => {
      console.log(res);
      if (res.result[0][this.usernameForAccess] !== false) {
        this.cardDetails.user_access_list.push({
          username: this.usernameForAccess,
          card_id: this.cardDetails.card_id,
          access_type: 'RO'
        });
        this.oldValues.user_access_list = this.cardDetails.user_access_list;
        this.editable.accessList = !this.editable.accessList;
        this.usernameForAccess = '';
      } else if (res.result[0][this.usernameForAccess] === 'Already Exist') {
        this.common.openDialogMessage('Already Exist', 'User ' + this.usernameForAccess + ' already has access.');
      } else {
        this.common.openDialogMessage('Error', 'User ' + this.usernameForAccess + ' is not available or not verified.');
      }
    }, () => {
      this.common.openDialogMessage('Error', 'Error while giving access to ' + this.usernameForAccess);
    });
  }

  changeUserAccessType($event, $data): void {
    console.log($data.access_type);
    const actionName = $event.checked ? 'access_RW' : 'access_RO';
    const data = { card_id: this.cardDetails.card_id, action_name: actionName, username: $data.username };
    this.request.updateCardAccess(data).subscribe(res => {
      console.log(res);
    }, err => {
      console.error(err);
    });
  }

  getEvent($event): void {
    console.log($event);
    return $event;
    // const data = {card_id : this.cardDetails.card_id}
  }

  changeUserAccessStatus($data): void {
    // console.log($data, 'change');
    console.log($data.access_status, 'change');
    const actionName = $data.access_status ? 'enable' : 'disable';
    const data = { card_id: this.cardDetails.card_id, action_name: actionName, username: $data.username };
    this.request.updateCardAccess(data).subscribe(res => {
      console.log(res);
    }, err => {
      console.error(err);
    });
  }

  deleteUserAccess($data): void {
    this.common.openConfirmationDialog().subscribe(res => {
      if (res) {
        const findItem = this.cardDetails.user_access_list.indexOf($data);
        if (findItem >= 0) {
          const data = { card_id: this.cardDetails.card_id, action_name: 'delete', username: $data.username };
          this.request.updateCardAccess(data).subscribe(res1 => {
            this.cardDetails.user_access_list.splice(findItem, 1);
            this.oldValues.user_access_list = this.cardDetails.user_access_list;
          }, err => {
            this.common.openDialogMessage('Error', 'Error while deleting card access');
          });
        }
      }
    });
  }

  deleteCard(): void {
    this.common.openConfirmationDialog().subscribe(res => {
      if (res) {
        this.request.actionOnCards({ card_ids: [this.cardDetails.card_id] }, 'delete').subscribe(res1 => {
          this.router.navigate(['/']);
        }, err => {
          this.common.openDialogMessage('Error', 'Error while performing action: delete');
        });
      }
    });
  }
}
