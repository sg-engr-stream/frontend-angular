import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from '../../dialogs/message-dialog/message-dialog.component';
import { CardCreateComponent } from '../../dialogs/card-create/card-create.component';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  isLoggedIn: boolean;
  user: string;
  name: string;
  emailVerified: boolean;
  email: string;
  onlyWidget = false;
  constructor(public dialog: MatDialog, private cookie: CookieService, private router: Router) {
    if (this.cookie.check('name')) {
      this.name = this.cookie.get('name');
    }
    if (this.cookie.check('loggedIn')) {
      this.isLoggedIn = this.cookie.get('loggedIn') === '1';
    }
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

  openDialogCardCreate(message): void {
    const dialogRef = this.dialog.open(CardCreateComponent, {
      width: '80%',
      data: {message}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog Closed', result);
    });
  }

  isUserLoggedIn(): boolean {
    return this.isLoggedIn || this.cookie.check('token');
  }

  logout(): void {
    this.isLoggedIn = false;
    this.cookie.delete('token');
    this.cookie.delete('name');
    this.cookie.delete('loggedIn');
    this.router.navigate(['/home']);
  }

  setUserDetails(res, redirect = true): void {
    const user = res as User;
    this.cookie.set('name', user.name.toUpperCase());
    this.cookie.set('loggedIn', '1');
    this.name = user.name.toUpperCase();
    this.email = user.email;
    this.emailVerified = user.verified;
    this.isLoggedIn = true;
    if (redirect === true) {
      this.router.navigate(['/profile']);
    }
  }
}
