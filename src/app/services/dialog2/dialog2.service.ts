import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccessListDialogComponent } from '../../dialogs/access-list-dialog/access-list-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class Dialog2Service {

  constructor(private dialog: MatDialog) { }

  openAccessListDialog(data): any {
    const dialogRef = this.dialog.open(AccessListDialogComponent, {
      width: '90%',
      maxWidth: '600px',
      maxHeight: (window.screen.height - 260) + 'px',
      data: {data}
    });
    return dialogRef.afterClosed();
  }
}
