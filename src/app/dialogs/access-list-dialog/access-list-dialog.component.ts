import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Group } from '../../models/group';
import { RequestsService } from '../../services/requests/requests.service';
import { CommonService } from '../../services/common/common.service';
import { LoaderService } from '../../services/loader/loader.service';

@Component({
  selector: 'app-access-list-dialog',
  templateUrl: './access-list-dialog.component.html',
  styleUrls: ['./access-list-dialog.component.scss']
})
export class AccessListDialogComponent implements OnInit {

  groupDetails = {} as Group;
  usernameForAccess = '';
  accessInput = false;
  editable = {
    owner: false,
    description: false,
    title: false,
    icon_url: false
  };
  oldValues = {
    title: null,
    owner: null,
    description: null,
    icon_url: null
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private request: RequestsService, private common: CommonService,
              private loaderService: LoaderService) {
  }

  ngOnInit(): void {
    this.groupDetails = this.data.data as Group;
    this.initOldValues();
  }

  addUserForGroupAccess(): any {
    const d = {
      username: this.usernameForAccess,
      access_type: 'RO',
      access_status: true,
      group_id: this.groupDetails.group_id
    };
    this.request.addGroupAccess(d).subscribe(res => {
      if (typeof res.result[d.username] === typeof {}) {
        this.groupDetails.user_access_list.push(res.result[d.username]);
        this.usernameForAccess = '';
      } else {
        this.common.openDialogMessage('Not added', 'Invalid user or already added.');
      }
    }, err => {
      this.common.openDialogMessage('Error', 'Failed to add the entered user.');
    });
    this.accessInput = !this.accessInput;
  }

  changeUserAccessStatus($data): any {
    this.deleteOrUpdateUserAccessStatusOrType($data, $data.access_status ? 'enable' : 'disable');
  }

  changeUserAccessType($event, $data): void {
    this.deleteOrUpdateUserAccessStatusOrType($data, $event.checked ? 'access_RW' : 'access_RO');
  }

  getEvent($event): any {
    return $event;
  }

  deleteOrUpdateUserAccessStatusOrType($data, actionName = null): any {
    console.log($data);
    actionName = actionName === null ? 'delete' : actionName;
    this.common.openConfirmationDialog().subscribe(res => {
      if (res) {
        this.request.updateGroupAccess({
          username: $data.username,
          group_id: this.groupDetails.group_id,
          action_name: actionName
        }).subscribe(
          res1 => {
            if (actionName === 'delete') {
              const findItem = this.groupDetails.user_access_list.indexOf($data);
              if (findItem >= 0) {
                this.groupDetails.user_access_list.splice(findItem, 1);
              }
            }
          }, err => {
            this.common.openDialogMessage('Error', 'Error in performing action: ' + actionName === null ? 'delete' : actionName);
          });
      }
    });
  }

  initOldValues(): void {
    this.oldValues.title = this.groupDetails.title;
    this.oldValues.owner = this.groupDetails.owner;
    this.oldValues.description = this.groupDetails.description;
    this.oldValues.icon_url = this.groupDetails.icon_url;
  }

  updateFieldByKey(key, state = true): void {
    let updateDict = {};
    switch (key) {
      case 'title' :
        updateDict = { title: this.groupDetails.title };
        break;
      case 'owner':
        updateDict = { owner: this.groupDetails.owner };
        break;
      case 'description':
        updateDict = { description: this.groupDetails.description };
        break;
      case 'icon_url':
        updateDict = { icon_url: this.groupDetails.icon_url };
        break;
      default:
        return;
    }
    this.editable[key] = !this.editable[key];
    console.log(updateDict);
    if (!state) {
      this.groupDetails[Object.keys(updateDict)[0]] = this.oldValues[Object.keys(updateDict)[0]];
      return;
    }
    this.request.updateGroupDetails(this.groupDetails.group_id, updateDict).subscribe(res => {
      console.log(res);
      this.oldValues[Object.keys(updateDict)[0]] = this.groupDetails[Object.keys(updateDict)[0]];
    }, err => {
      this.groupDetails[Object.keys(updateDict)[0]] = this.oldValues[Object.keys(updateDict)[0]];
      if (err.error.statusCode === 404) {
        this.common.openDialogMessage('Not found', 'Record does not exist.');
      } else {
        this.common.openDialogMessage('Error', err.error.response);
      }
    });
    this.loaderService.hide();
  }
}
