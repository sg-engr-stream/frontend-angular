import { Injectable } from '@angular/core';
import { EditComponent } from '../../routes/edit/edit.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  openDialogCardDetails(cardDetails): void {
    const dialogRef = this.dialog.open(EditComponent, {
      width: '90%',
      maxHeight: (window.screen.height - 260) + 'px',
      data: {cardDetails}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog Closed', result);
    });
  }
}
