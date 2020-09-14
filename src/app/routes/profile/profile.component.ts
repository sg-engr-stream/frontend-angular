import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common/common.service';
import { RequestsService } from '../../services/requests/requests.service';
import { DialogService } from '../../services/dialog/dialog.service';
import { GridOptions } from 'ag-grid-community';
import { BtnCellRendererComponent } from '../../renderer/btn-cell-renderer/btn-cell-renderer.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  selectedGroupOwned: string;
  selectedGroupAccess: string;
  frameworkComponents: any;

  columnDefsCard = [
    { headerName: 'Title', field: 'title', headerCheckboxSelection: true, checkboxSelection: true, width: 170 },
    { headerName: 'Description', field: 'description', width: 300 },
    {
      headerName: 'Expiry', field: 'expiry', valueGetter: (params) => {
        if (params.data.expiry === null) {
          return 'No Expiry';
        }
        return new Date(params.data.expiry).toLocaleString();
      }, cellStyle: (params) => {
        let color = '';
        const check = new Date(params.value) <= new Date(new Date().toUTCString());
        if (params.value == null || !check) {
          color = 'green';
        } else {
          color = 'red';
        }
        return { color };
      }
    },
    {
      headerName: 'Actions', floatingFilter: false, cellRenderer: 'btnCellRenderer',
      cellRendererParams: {
        clicked: (field: any) => {
          console.log(field);
          this.openCardInDialog(field.data);
        }
      },
      width: 300,
      minWidth: 150
    }
  ];

  rowDataCard: any = [];
  gridOptionsCard: any = {
    defaultColDef: {
      resizable: true,
      sortable: true,
      floatingFilter: true,
      filter: 'agTextColumnFilter',
      headerCheckboxSelectionFilteredOnly: true
    }
  } as GridOptions;

  rowDataGroup = [];

  groupOptionListOwner = [];
  groupOptionListAccess = [];

  constructor(private common: CommonService, private request: RequestsService, private dialogService: DialogService) {
    this.frameworkComponents = {
      btnCellRenderer: BtnCellRendererComponent
    };
  }

  ngOnInit(): void {
    if (this.common.username !== null) {
      this.request.getProfileData().subscribe(res => {
        this.rowDataCard = res.result.owner;
        this.rowDataCard.concat(res.result.shared_with_me);
        this.groupOptionListOwner = res.result.groups_owned;
        this.groupOptionListAccess = res.result.groups_shared_with_me;
      }, () => {
        this.common.openDialogMessage('Error loading profile', 'Error occurred while trying to load your profile. Contact us, if you think there is some problem in product.');
      });
    }
  }

  openCardInDialog(cardDetails): void {
    if (cardDetails.access_type === undefined) {
      cardDetails.access_type = 'RW';
    }
    this.dialogService.openDialogCardDetails(cardDetails);
  }

  gridReadyCard(): void {
    this.gridOptionsCard.api.sizeColumnsToFit();
  }

  groupCreateDisabled(): boolean {
    if (this.gridOptionsCard.api !== undefined) {
      return this.gridOptionsCard.api.getSelectedRows().length === 0;
    }
    return true;
  }

  groupCreateAction(): void {
    let groupName;
    this.dialogService.openDialogInput('', '', null).subscribe(result => {
      console.log('Dialog Closed', result);
      groupName = result !== undefined ? result.fieldValue : null;
      console.log(groupName);
      const rows = this.gridOptionsCard.api.getSelectedRows();
      const cardIds = [];
      for (const card of rows) {
        cardIds.push(card.card_id);
      }
      console.log(cardIds);
      if (result.title.length > 0 && result.description.length > 0) {
        const iconUrl = result.iconUrl !== undefined ? result.iconUrl !== null ? result.iconUrl : '' : '';
        this.request.createGroup(
          result.title, result.description, iconUrl, cardIds
        ).subscribe(() => {
          this.common.openDialogMessage('Successfully Created', 'Group has been successfully created.');
        }, () => {
          this.common.openDialogMessage('Group Creation Failed', 'Failed to create the group.');
        });
      } else {
        this.common.openDialogMessage('Invalid Details', 'Invalid details for group creation')
      }
    });
  }
}
