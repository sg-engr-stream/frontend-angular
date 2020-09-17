import { Injectable } from '@angular/core';
import { EditComponent } from '../../routes/edit/edit.component';
import { MatDialog } from '@angular/material/dialog';
import { InputDialogComponent } from '../../dialogs/input-dialog/input-dialog.component';
import { ConfirmComponent } from '../../dialogs/confirm/confirm.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  openDialogCardDetails(cardDetails): any {
    const dialogRef = this.dialog.open(EditComponent, {
      width: '90%',
      maxHeight: (window.screen.height - 260) + 'px',
      data: {cardDetails}
    });
    return dialogRef.afterClosed();
  }

  openDialogInput(title, description, iconUrl): any {
    const dialogRef = this.dialog.open(InputDialogComponent, {
      width: '90%',
      maxHeight: '500px',
      maxWidth: '250px',
      data: {title, description, iconUrl}
    });
    return dialogRef.afterClosed();
  }
}
