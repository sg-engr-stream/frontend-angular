import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from '../../dialogs/message-dialog/message-dialog.component';
import { CardCreateComponent } from '../../dialogs/card-create/card-create.component';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  isLoggedIn: boolean;
  user: string;
  name: string;
  emailVerified: boolean;
  email: string;
  constructor(public dialog: MatDialog) {
  }

  openDialogMessage(title, message): void {
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      width: '400px',
      data: {title, message}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog Closed', result);
    });
  }

  openDialogCardCreate(title, message): void {
    const dialogRef = this.dialog.open(CardCreateComponent, {
      width: '80%',
      data: {title, message}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog Closed', result);
    });
  }

  isUserLoggedIn(): boolean {
    return this.isLoggedIn;
  }
}
