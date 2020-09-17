import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common/common.service';
import { RequestsService } from '../../services/requests/requests.service';
import { DialogService } from '../../services/dialog/dialog.service';
import { GridOptions } from 'ag-grid-community';
import { BtnCellRendererComponent } from '../../renderer/btn-cell-renderer/btn-cell-renderer.component';
import { Dialog2Service } from '../../services/dialog2/dialog2.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  frameworkComponents: any;

  columnDefsCard = [
    {
      headerName: 'Title',
      field: 'title',
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 170,
      minWidth: 100
    },
    { headerName: 'Description', field: 'description', width: 300, minWidth: 200 },
    {
      headerName: 'Status', field: 'status', width: 150, minWidth: 100, valueGetter: params => {
        if (params.data.status) {
          return 'Active';
        } else {
          return 'Inactive';
        }
      }
    },
    {
      headerName: 'Access Type', field: 'access_type', width: 150, minWidth: 100,
      valueGetter: params => {
        if (params.data.owner === this.common.username) {
          return 'Owner';
        } else if (params.data.access_type === null) {
          return 'RW';
        } else {
          return params.data.access_type;
        }
      }
    },
    {
      headerName: 'Expiry', field: 'expiry', minWidth: 150, valueGetter: (params) => this.formattedExpiry(params),
      cellStyle: (params) => this.expiryColor(params)
    },
    {
      headerName: 'Actions', floatingFilter: false, cellRenderer: 'btnCellRenderer',
      cellRendererParams: {
        clicked: (field: any) => {
          console.log(field);
          this.openCardInDialog(field.data).subscribe(res => {
            if (res) {
              this.request.actionOnCards({ card_ids: [field.data.card_id] }, 'delete').subscribe(res1 => {
                // this.gridOptionsCard.api.applyTransaction({ remove: selectedCards });
                this.ngOnInit();
              }, err => {
                this.common.openDialogMessage('Error', 'Error while performing action: delete');
              });
            }
          }, err => {
          });
        }
      },
      width: 380,
      minWidth: 380
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

  columnDefsGroup = [
    {
      headerName: 'Title',
      field: 'title',
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 170,
      minWidth: 100
    },
    { headerName: 'Description', field: 'description', width: 300, minWidth: 200 },
    {
      headerName: 'Expiry', field: 'expiry', minWidth: 150, valueGetter: (params) => this.formattedExpiry(params),
      cellStyle: (params) => this.expiryColor(params)
    }
  ];
  rowDataGroup = [];
  gridOptionsGroup: any = {
    defaultColDef: {
      resizable: true,
      sortable: true,
      floatingFilter: true,
      filter: 'agTextColumnFilter',
    }
  } as GridOptions;

  cardAdditionToExistingGroupEnabled = false;
  selectedGroupToAddCardInto: any;

  selectedGroup: string;
  selectedGroupDetails: any = {};
  selectGroupOptionList = [];
  allLoadedGroupData = {};
  cardAdditionByGroupEnabled = true;
  cardsListNotInGroup = [];
  cardsListNotInGroupValue: any;


  constructor(public common: CommonService, private request: RequestsService, private dialogService: DialogService,
              private dialog2: Dialog2Service) {
    this.frameworkComponents = {
      btnCellRenderer: BtnCellRendererComponent
    };
  }

  ngOnInit(): void {
    if (this.common.username !== null) {
      this.request.getProfileData().subscribe(res => {
        this.rowDataCard = res.result.owner;
        this.rowDataCard.concat(res.result.shared_with_me);
        this.allLoadedGroupData = res.result.cards_in_group;
        this.selectGroupOptionList = [];
        Object.keys(this.allLoadedGroupData).forEach((key) => {
          this.selectGroupOptionList.push(this.allLoadedGroupData[key].group_details);
        });
        if (this.selectGroupOptionList.length > 0) {
          this.selectedGroupDetails = this.selectGroupOptionList[0];
          this.selectedGroup = this.selectedGroupDetails.group_id;
          this.rowDataGroup = this.allLoadedGroupData[this.selectedGroup].card_list;
          this.updateCardListNotInGroup(this.rowDataCard, this.rowDataGroup);
        }
      }, () => {
        this.common.openDialogMessage('Error loading profile', 'Error occurred while trying to load your profile. Contact us, if you think there is some problem in product.');
      });
    }
  }

  expiryColor(params): any {
    let color;
    const check = new Date(params.value) <= new Date(new Date().toUTCString());
    if (params.value == null || !check) {
      color = 'green';
    } else {
      color = 'red';
    }
    return { color };
  }

  formattedExpiry(params): any {
    if (params.data.expiry === null) {
      return 'No Expiry';
    }
    return new Date(params.data.expiry).toLocaleString();
  }

  openCardInDialog(cardDetails): any {
    if (cardDetails.access_type === undefined) {
      cardDetails.access_type = 'RW';
    }
    return this.dialogService.openDialogCardDetails(cardDetails);
  }

  gridReadyCard(): void {
    this.gridOptionsCard.api.sizeColumnsToFit();
  }

  gridReadyGroup(): void {
    this.gridOptionsGroup.api.sizeColumnsToFit();
  }

  isCardSelectedListEmpty(): boolean {
    if (this.gridOptionsCard.api !== undefined) {
      return this.gridOptionsCard.api.getSelectedRows().length === 0;
    }
    return true;
  }

  activateDeactivateCards(actionName): void {
    this.common.openConfirmationDialog().subscribe(res => {
      if (res) {
        let status;
        if (actionName === 'activate') {
          status = true;
        } else if (actionName === 'deactivate') {
          status = false;
        } else {
          return;
        }

        const selectedCards = this.gridOptionsCard.api.getSelectedRows();
        const cardIds = [];
        selectedCards.forEach(card => {
          card.status = status;
          this.gridOptionsCard.rowData.forEach(row => {
            if (row.card_id === card.card_id) {
              row.status = status;
              cardIds.push(row.card_id);
            }
          });
        });
        this.request.actionOnCards({ card_ids: cardIds }, actionName).subscribe(res1 => {
          console.log(res);
          this.gridOptionsCard.api.applyTransaction({ update: selectedCards });
        }, err => {
          this.common.openDialogMessage('Error', 'Error while performing action: ' + actionName);
        });
      }
    });

  }

  deleteSelectedCards(): void {
    this.common.openConfirmationDialog().subscribe(res => {
      if (res) {
        const selectedCards = this.gridOptionsCard.api.getSelectedRows();
        const cardIds = [];
        selectedCards.forEach(card => {
          const findItem = this.gridOptionsCard.rowData.indexOf(card);
          if (findItem >= 0) {
            this.gridOptionsGroup.rowData.splice(findItem, 1);
            cardIds.push(card.card_id);
          }
        });
        this.request.actionOnCards({ card_ids: cardIds }, 'delete').subscribe(res1 => {
          // this.gridOptionsCard.api.applyTransaction({ remove: selectedCards });
          this.ngOnInit();
        }, err => {
          this.common.openDialogMessage('Error', 'Error while performing action: delete');
        });
      }
    });
  }

  addCardToExistingGroup(value = null): void {
    if (value === 'confirm') {
      const selectedCards = this.gridOptionsCard.api.getSelectedRows();
      const cardsToAdd = [];
      const cardIdsToAdd = [];
      const cardsInGroup = this.allLoadedGroupData[this.selectedGroupToAddCardInto].card_list;
      selectedCards.forEach(card => {
        let toAdd = true;
        cardsInGroup.forEach(c2 => {
          if (card.card_id === c2.card_id) {
            toAdd = false;
          }
        });
        if (toAdd) {
          cardsToAdd.push(card);
          cardIdsToAdd.push(card.card_id);
        }
      });
      this.request.addCardsToExistingGroup({ group_id: this.selectedGroupToAddCardInto, card_ids: cardIdsToAdd })
        .subscribe(res => {
          const fullList = this.allLoadedGroupData[this.selectedGroupToAddCardInto].card_list.concat(cardsToAdd);
          this.allLoadedGroupData[this.selectedGroupToAddCardInto].card_list = fullList;
          if (this.selectedGroupToAddCardInto === this.selectedGroup) {
            this.gridOptionsGroup.api.applyTransaction({ add: cardsToAdd });
          }
        }, err => {
          this.common.openDialogMessage('Error', 'Error while performing action: add to group');
        });
    }
    this.cardAdditionToExistingGroupEnabled = !this.cardAdditionToExistingGroupEnabled;
  }

  groupCreateAction(): void {
    let groupName;
    this.dialogService.openDialogInput('', '', null).subscribe(result => {
      console.log('Dialog Closed', result);
      if (result === false) {
        return;
      }
      groupName = result !== undefined ? result.title : null;
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
        ).subscribe(res => {
          const groupIds = Object.keys(this.allLoadedGroupData);
          groupIds.push(res.result.group.group_id);
          this.request.getCardDetailsByGroupIds(groupIds).subscribe(res1 => {
            this.selectGroupOptionList.push({ group_id: res.result.group.group_id, title: result.title });
            this.allLoadedGroupData = res1.result;
            if (this.selectGroupOptionList.length > 0) {
              this.selectedGroup = this.selectGroupOptionList[0].group_id;
              this.rowDataGroup = this.allLoadedGroupData[this.selectedGroup];
            }
            this.common.openDialogMessage('Successfully Created', 'Group has been successfully created.');
          }, err => {
            let msg = 'Failed to fetch again. Please refresh page to see changes.';
            if (err.error.statusCode === 501 || err.error.statusCode === 502) {
              msg = 'Group created. Email sending failed. Refresh screen to see changes.';
            }
            this.common.openDialogMessage('Successfully Created', msg);
          });
        }, () => {
          this.common.openDialogMessage('Group Creation Failed', 'Failed to create the group.');
        });
      } else {
        this.common.openDialogMessage('Invalid Details', 'Invalid details for group creation');
      }
    });
  }

  selectGroupChange($event): void {
    this.rowDataGroup = this.allLoadedGroupData[$event.value].card_list;
    this.gridOptionsGroup.rowData = this.rowDataGroup;
    this.selectedGroupDetails = this.allLoadedGroupData[$event.value].group_details;
    this.updateCardListNotInGroup();
  }

  deleteGroup(): void {
    this.common.openConfirmationDialog().subscribe(res => {
      if (res) {
        const itemFound = this.selectGroupOptionList.indexOf(this.selectedGroupDetails);
        if (itemFound >= 0) {
          this.request.actionOnGroups({ group_id: this.selectedGroup }, 'delete').subscribe(res1 => {
            this.selectGroupOptionList.splice(itemFound, 1);
            delete this.allLoadedGroupData[this.selectedGroup];
            if (this.selectGroupOptionList.length > 0) {
              this.selectedGroupDetails = this.selectGroupOptionList[0];
              this.selectedGroup = this.selectedGroupDetails.group_id;
              this.rowDataGroup = this.allLoadedGroupData[this.selectedGroup].card_list;
            } else {
              this.rowDataGroup = [];
              this.selectedGroupDetails = {};
            }
          }, err => {
            this.common.openDialogMessage('Delete Error', 'Error while deleting the group.');
          });
        }
      }
    });
  }

  editGroupAccess(): void {
    this.dialog2.openAccessListDialog(this.selectedGroupDetails).subscribe(res => {
      console.log(res);
    });
  }

  activateDeactivateGroup(): void {
    const actionName = this.selectedGroupDetails.status ? 'deactivate' : 'activate';
    this.common.openConfirmationDialog().subscribe(res => {
      if (res) {
        this.request.actionOnGroups({ group_id: this.selectedGroup }, actionName).subscribe(res1 => {
          this.selectedGroupDetails.status = !this.selectedGroupDetails.status;
          this.allLoadedGroupData[this.selectedGroup].group_details.status = this.selectedGroupDetails.status;
        }, err => {
          this.common.openDialogMessage('Error', 'Error while performing the action: ' + actionName);
        });
      }
    });
  }

  deleteCardFromGroup(): void {
    this.common.openConfirmationDialog().subscribe(res => {
      if (res) {
        const selectedRows = this.gridOptionsGroup.api.getSelectedRows();
        const selectedRowIds = [];
        selectedRows.forEach(item => {
          const findItem = this.gridOptionsGroup.rowData.indexOf(item);
          if (findItem >= 0) {
            selectedRowIds.push(item.card_id);
            this.gridOptionsGroup.rowData.splice(findItem, 1);
          }
        });
        this.request.removeCardsFromGroups({
          group_id: this.selectedGroup,
          card_ids: selectedRowIds
        }).subscribe(res1 => {
          this.gridOptionsGroup.api.applyTransaction({ remove: this.gridOptionsGroup.api.getSelectedRows() });
        }, err => {
          this.common.openDialogMessage('Error', 'Error while removing cards from group.');
        });
      }
    });
  }

  addCardToGroup(value = null): void {
    this.updateCardListNotInGroup();
    const cardsFromOwner = this.gridOptionsCard.rowData;
    if (value === 'confirm') {
      cardsFromOwner.forEach(card => {
        if (card.card_id === this.cardsListNotInGroupValue) {
          this.request.addCardsToExistingGroup({ group_id: this.selectedGroup, card_ids: [card.card_id] })
            .subscribe(res => {
              this.gridOptionsGroup.rowData.push(card);
              this.gridOptionsGroup.api.applyTransaction({ add: [card] });
              this.updateCardListNotInGroup();
              return 0;
            }, err => {
              this.common.openDialogMessage('Error', 'Error while performing action: add to group');
            });
        }
      });
    }
    this.cardAdditionByGroupEnabled = !this.cardAdditionByGroupEnabled;
  }

  groupRemoveCardDisabled(): boolean {
    if (this.gridOptionsGroup.api !== undefined) {
      return this.gridOptionsGroup.api.getSelectedRows().length === 0;
    }
    return true;
  }

  updateCardListNotInGroup(cardData = null, groupData = null): any {
    const cardsFromOwner = cardData === null ? this.gridOptionsCard.rowData : cardData;
    const cardsInGroup = groupData === null ? this.gridOptionsGroup.rowData : groupData;
    const cardIds = [];
    cardsInGroup.forEach(item => {
      cardIds.push(item.card_id);
    });
    this.cardsListNotInGroup = [];
    cardsFromOwner.forEach(card => {
      const findIndex = cardIds.indexOf(card.card_id);
      if (findIndex < 0) {
        this.cardsListNotInGroup.push(card);
      }
    });
  }

  returnObjectKeys(obj): any {
    return Object.keys(obj);
  }

  openWidget(): void {
    window.open(window.location.origin + '/wg/' + this.selectedGroupDetails.group_id);
  }
}
